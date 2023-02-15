// imports for react native
import { Input, Text, View, SafeAreaView, ScrollView, Alert, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from "react";

// imports for all the google apis
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';

// google cloud api key
import { config } from '../config'; 



// back end requests
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons'; 

// used for time
import moment from 'moment';

// all the styles
import { styles } from '../Styles/StyleSheet';

export default function MainPage({route, navigation}) {
  const apiKey = (config.apiKey);

  const longitudeDelta = 0.01;
  const latitudeDelta = 0.01;

  // a default position in case the user doesn't want to share their location
  const defaultLocation = {coords:{
    latitude: 32.98,
    longitude: -96.75,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}

  const resizeMap = () =>{
    const options = {
        edgePadding: EDGE_PADDING,
        animated: true
    }
    mapRef.current.fitToElements(options);
  }

  const [location, setLocation] = useState(null);

  // gets current user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation(defaultLocation);
        return;
      }      
      Location.getCurrentPositionAsync()
      .then((l)=>{
        setLocation(l);
      }
      );
    })();
  }, []);

  const EDGE_PADDING = {
    top: 45,
    right: 45,
    bottom: 45,
    left: 45
  }

  const comp = useRef();
  const routeArray = route.params.placeObjectArray;
  // the main state that is used to render all of the map markers
  const [placeObjectArray, setPlaceObjectArray] = useState([]); 
  useEffect(()=>{
    // used from navigation, gets and sets the place object array to view history
    if (routeArray.length > 0){
        setPathArr([]);
        setPlaceObjectArray(routeArray);
        if (placeObjectArray.length>0){
            handleShowPress();
        }
    }else{
        setPlaceObjectArray([]);
        setPathArr([]);
        setDistance(0);
        setTime(0);
    }
    
  },[routeArray,route,navigation]);

  // updates routes whenevert the place object array gets updated
  useEffect(()=>{
    if (placeObjectArray.length>0){
        handleShowPress();
    }
  },[placeObjectArray])

  // this function is called whenever a user clicks on an element from the autocomplete dropdown
  const handleSubmit = (data, details) =>{
    comp.current.setAddressText("");
    const locationObject = {
      description: data.description,
      title: data.structured_formatting.main_text,
      coordinates: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      }
    }

    setPlaceObjectArray([...placeObjectArray,locationObject]); // simply adds the location object to the state
    
    // also reorients the map to show all of the markers
    resizeMap();
  }

  const mapRef = useRef(null);
  


  const [pathArr, setPathArr] = useState([]);
  const [time, setTime] = useState(0.0);
  const [distance, setDistance] = useState(0.0);
 
  const baseUrl = "http://10.176.199.107:8081";

  
  
  
  // this function is called to render routes 
  const handleShowPress = () =>{
    console.log("handling show press", placeObjectArray.length);
    setPathArr([]); // resets the path array in order to clear any routes on the map
    var arr = [];
    // loop prepares a 2d array of lat long vals to request routes between all the markers
    for (var i = 1; i<placeObjectArray.length; i++){
      if (i === 0){
        arr.push([{latitude: placeObjectArray[0].coordinates.latitude, longitude: placeObjectArray[0].coordinates.longitude},{latitude: placeObjectArray[1].coordinates.latitude, longitude: placeObjectArray[1].coordinates.longitude}]);
      }else{
        arr.push([{latitude: placeObjectArray[i-1].coordinates.latitude, longitude: placeObjectArray[i-1].coordinates.longitude},{latitude: placeObjectArray[i].coordinates.latitude, longitude: placeObjectArray[i].coordinates.longitude}]);
      }
    }
    
    var t = 0.0; 
    var d = 0.0;
    setPathArr(arr.map(
      (path, index)=>{
        console.log("index: ", index, path[0], path[1]);
        // note: we use a random key because react won't update state unless it sees that the key has changed or if the component position in the ui tree has changed
         return (
                  <MapViewDirections 
                    key = {Math.random()} 
                    mode= {'WALKING'} 
                    origin={path[0]} 
                    destination={path[1]} 
                    apikey={config.apiKey} 
                    onStart={(params) => {
                      console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                      console.log(`Distance: ${result.distance} km`)
                      console.log(`Duration: ${result.duration} min.`)
                      setDistance(d += result.distance);
                      setTime(t+= result.duration);
                    t += result.duration;
                    }}
                    onError={(errorMessage) => {
                      console.log('GOT AN ERROR', errorMessage);
                    }}
                    strokeWidth={3}
                    strokeColor="#559CAD"
                  ></MapViewDirections>)
        }));
        resizeMap();
  }
  // this function deletes a specified marker from the map
  const onDeletePress = (index) =>{
    setPathArr([]);
    var arr2 = placeObjectArray;
    if (arr2.length<3){
        setDistance(0);
        setTime(0);
    }
    if (arr2.length > 1){
      arr2.splice(index,1);
    }else{
      // js can't remove the last element from arrays...
      arr2 = [];
    }
    setPlaceObjectArray([...arr2]);
    resizeMap();
  } 
  // API call to save the route 
  const saveRouteAPI = async (objArray)=>{
    var date = moment()
      .utcOffset('-06:00')
      .format('YYYY-MM-DD hh:mm:ss-a');
    const o = {
        id : date,
        totalDuration: time,
        totalDistance: distance,
        object : objArray
    }
    console.log("function called", o);
    axios.post(`${baseUrl}/api/addRoute` , o ).then((response) => {
      console.log(response.data);
    });
  }

  const saveRoute = () =>{
    saveRouteAPI(placeObjectArray);
    Alert.alert('Save Route', 'Route has been saved', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ])
  }
  // adds user's current location to the place object array
  const addCurrentLocation = () =>{
    if (location !== null){
        Location.reverseGeocodeAsync({
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
        }).then((r)=>{
            console.log(r[0]);
            var locationObject = {
                description: r[0].name +", " + r[0].city +", "+r[0].region,
                title: r[0].name,
                coordinates: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }
              }
            setPlaceObjectArray([...placeObjectArray,locationObject]); // simply adds the location object to the state
            resizeMap(); 
    
        });
        
    }
    
    
  }
  
  return (
    <SafeAreaView style={{backgroundColor:"#FFBC42", flex:1, alignItems:"center"}}> 
      <View style={{ 
        justifyContent: "center",
        alignItems: "center",
		width: "95%",
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-around",
      }}>
        <ScrollView horizontal={false} nestedScrollEnabled={true} style={{
          width: "100%", 
        }} keyboardShouldPersistTaps='always'>
          <View style={{width: "100%",}}>
            <ScrollView centerContent={true}  horizontal={true} style={{ 
					    width: '100%',    	
				    }} keyboardShouldPersistTaps='always'> 
              <GooglePlacesAutocomplete
                  ref={comp}
                  placeholder="Where would you like to jog to?"
                  onPress={(data, details = null) => handleSubmit(data,details)}
                  query={{key: apiKey}}
                  fetchDetails={true}
                  onFail={error => console.log(error)}
                  onNotFound={() => console.log('no results')}
                  listViewDisplayed={false}
                  listEmptyComponent={() => (
                    <View style={{flex: 1}}>
                      <Text> No results were found </Text>
                    </View>
                  )}
                  textInputProps={{
                  InputComp: Input,
                  leftIcon: { type: 'font-awesome', name: 'chevron-left' },
                  errorStyle: { color: 'red' },
                  }}			
                  styles={{
                    textInputContainer: {
                      width: "100%",
                      alignContent: 'center',
                      padding: 2,
                      justifyContent: "center",
                      alignItems: "center"
                    },
                    textInput: {
                      height: 60,
                      width: "100%",
                      color: '#5d5d5d',
                      fontSize: 16,
                    },
                    container:{    
                      width:375,
                    }                    
                  }}
                />
                
            </ScrollView>
          </View>
          
        </ScrollView>        
      </View >
	  <View style={{         
      justifyContent: "center",
      alignItems: "center",
      //alignContent:"center",
      width: "100%",
    }}>
        <View style={{display:"flex", flexDirection:"row",justifyContent:"space-evenly", width:"95%", alignSelf:"center"}}>

            <View style={styles.historyPressableStyle}>
                <Text style={styles.placesPressableText}> 
                    Time: {Math.round(time)} minutes
                </Text>
            </View>

            <View style={styles.historyPressableStyle}>
                <Text style={styles.placesPressableText}> 
                    Jogged: {Math.round((distance*0.621371) * 100)/100} miles
                </Text>
            </View>

        </View>
      {location !== null ? // makes sure the map doesn't render until it gets user location
        (<MapView  
          ref={mapRef}
          provider={PROVIDER_GOOGLE} 
          style={styles.map}
          initialRegion = {
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            }
          }
        >
          { placeObjectArray.map((placeObject)=> (<Marker key={Math.random()} description={placeObject.description} title={placeObject.title} coordinate={placeObject.coordinates}></Marker>))}
          { pathArr }          
        </MapView>) : null}
		</View>
    <View style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
    
    <Pressable onPress={()=>navigation.push('HistoryPage') } style={styles.showRoutesPressable}>
        <Text style={styles.placesPressableText}>
				Show History
	    </Text>
	</Pressable>
    <Pressable onPress={()=>{saveRoute()}} style={styles.showRoutesPressable}>
        <Text style={styles.placesPressableText}>
				Save Route
	    </Text>
	</Pressable>
    <Pressable style={styles.showRoutesPressable} onPress={()=>addCurrentLocation()}>
        <AntDesign  name="flag" size={20} color="white" />
    </Pressable>
    </View>
    
    <ScrollView  style={{
			width: "100%",
			height: "45%",
		}}>
      {placeObjectArray.map(
        (placeObject,index)=>(
          <View key={index} style={{padding:10}}>
            <View  onLongPress={() => (onDeletePress(index))} style={styles.placesPressable}> 
              <Text  style={{...styles.placesPressableText, width:"80%"}}>{placeObject.description}</Text>
               <AntDesign  name="delete" size={20} color="white" onPress={() => onDeletePress(index)} /> 
            </View>            
          </View>
          ))}
    </ScrollView>      
  </SafeAreaView>
  );
}


