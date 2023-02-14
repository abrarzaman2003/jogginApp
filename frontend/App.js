import { StyleSheet, Input, Text, View, SafeAreaView, ScrollView, Dimensions, Button, Pressable } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { config } from './config'; // your google cloud api key
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IconFill, IconOutline } from "@ant-design/icons-react-native"
import { AntDesign } from '@expo/vector-icons'; 

export default function App() {
  const apiKey = (config.apiKey);

  const longitudeDelta = 0.01;
  const latitudeDelta = 0.01;

  const defaultLocation = {coords:{
    latitude: 32.98,
    longitude: -96.75,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}

  const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);

  // gets current user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");
        setLocation(defaultLocation);
        return;
      }      
      Location.getCurrentPositionAsync()
      .then((l)=>
        setLocation(l)
      );
    })();
  }, []);

  const EDGE_PADDING = {
    top: 25,
    right: 25,
    bottom: 25,
    left: 25
  }
  // the main state that is used to render all of the map markers
  const [placeObjectArray, setPlaceObjectArray] = useState([]); 
  // this function is called whenever a user clicks on an element from the autocomplete dropdown
  const handleSubmit = (data, details) =>{
    const locationObject = {
      description: data.description,
      title: data.structured_formatting.main_text,
      coordinates: {
        longitude: details.geometry.location.lng,
        latitude: details.geometry.location.lat,
      }
    }
    // console.log(locationObject);
    setPlaceObjectArray([...placeObjectArray,locationObject]); // simply adds the location object to the state
    const options = {
      edgePadding: EDGE_PADDING,
      animated: true
    }
    mapRef.current.fitToElements(options); // also reorients the map to show all of the markers
    // console.log(placeObjectArray.length);
  }

  const mapRef = useRef(null);
  


  const [pathArr, setPathArr] = useState([]);
  const [time, setTime] = useState(0.0);
  const [distance, setDistance] = useState(0.0);
 
  const baseUrl = "http://192.168.1.194:8081";

  
  const apiTest = async ()=>{
    axios.get(`${baseUrl}`).then((response) => {
      console.log(response.data);
    });
  }
  
  // this function is called to render routes whenever the user presses show routes
  const handleShowPress = () =>{
    apiTest();
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
  }
  // this function deletes a specified marker from the map
  const onDeletePress = (index) =>{
    var arr2 = placeObjectArray;
    if (arr2.length > 1){
      arr2.splice(index,1);
    }else{
      // js can't remove the last element from arrays...
      arr2 = [];
    }
    setPlaceObjectArray([...arr2]);
    const options = {
      edgePadding: EDGE_PADDING,
      animated: true
    }
    // makes sure to readjust the map to fit to remaining markers
    mapRef.current.fitToElements(options);
  }  
  
  return (
    <SafeAreaView style={{backgroundColor:"#FFBC42", flex:1}}> 
      <View style={{ 
        justifyContent: "center",
        alignItems: "center",
		    width: "100%",
      }}>
        <ScrollView horizontal={false} nestedScrollEnabled={true} style={{
          width: "100%" 
        }} keyboardShouldPersistTaps='always'>
          <View style={{width: "100%",}}>
            <ScrollView centerContent={true}  horizontal={true} style={{ 
					    width: '100%',    	
				    }} keyboardShouldPersistTaps='always'> 
              <GooglePlacesAutocomplete
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
      width: "100%",
    }}>
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
          {placeObjectArray.map((placeObject, index)=> (<Marker key={index} description={placeObject.description} title={placeObject.title} coordinate={placeObject.coordinates}></Marker>))}
          {pathArr}          
        </MapView>) : null}
		</View>
    <Pressable onPress={handleShowPress} style={styles.showRoutesPressable}>
      <Text style={styles.placesPressableText}>
				Show Routes
			</Text>
		</Pressable>
    <Text style={styles.placesPressableText}> 
    Time Required: {Math.round(time)} minutes
    {/* Time Required: {time} */}
    </Text>
    <Text style={styles.placesPressableText}> 
    Jogged: {Math.round((distance*0.621371) * 100)/100} miles
    </Text>
    <ScrollView  style={{
			width: "100%",
			height: "45%",
		}}>
      {placeObjectArray.map(
        (placeObject,index)=>(
          <View key={index} style={{padding:10}}>
            <View onLongPress={() => (onDeletePress(index))} style={styles.placesPressable}>
              <Text style={{...styles.placesPressableText, width:"80%"}}>{placeObject.description}</Text>
              <AntDesign name="delete" size={20} color="white" onPress={onDeletePress} />
            </View>
          </View>
          ))}
    </ScrollView>      
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    borderWidth: 1,
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height / 2 - 80,
    borderRadius: 16,
    margin: 10,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    borderColor: "#FFA782",
    borderBottomWidth: 3,
    borderRightWidth: 4,
    borderRadius: 16,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 9,
  },
  placesPressable :{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderColor: "#FFA782",
    borderBottomWidth: 3,
    borderRightWidth: 4,
    borderRadius: 16,
    backgroundColor: "#EF5B5B",
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  placesPressableText: {
    fontSize: 14,
    margin: 5,
    padding: 5,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  showRoutesPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#4A5899',
    borderBottomWidth: 3,
    borderRightWidth: 4,
    borderRadius: 16,
    borderColor: "#559CAD",
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
  }

  
});
