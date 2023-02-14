import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Input, Text, View, SafeAreaView, ScrollView, Dimensions, Button, Pressable } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { config } from './config'; // your google cloud api key
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';



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
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
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
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  }
  const [placeObjectArray, setPlaceObjectArray] = useState([]);
  const handleSubmit = (data, details) =>{
    const locationObject = {
      description: data.description,
      title: data.structured_formatting.main_text,
      coordinates: {
        longitude: details.geometry.location.lng,
        latitude: details.geometry.location.lat,
      }
    }
    console.log(locationObject);
    setPlaceObjectArray([...placeObjectArray,locationObject]);
    const options = {
      edgePadding: EDGE_PADDING,
      animated: true
    }
    mapRef.current.fitToElements(options);
    console.log(placeObjectArray.length);
  }

  const mapRef = useRef(null);
  


  const [pathArr, setPathArr] = useState([]);
  const [time, setTime] = useState(0.0);
  const [distance, setDistance] = useState(0.0);
 
  
  
  const resetState = () =>{
	setTime(0.0);
	t = 0;
	setDistance(0.0)
  }
  
  const handlePress = () =>{
    setPathArr([]);
    var arr = [];
    for (var i = 1; i<placeObjectArray.length; i++){
      //console.log(placeObjectArray[i].coordinates.latitude);
      if (i === 0){
        arr.push([{latitude: placeObjectArray[0].coordinates.latitude, longitude: placeObjectArray[0].coordinates.longitude},{latitude: placeObjectArray[1].coordinates.latitude, longitude: placeObjectArray[1].coordinates.longitude}]);
        //console.log([[placeObjectArray[0].coordinates.latitude, placeObjectArray[0].coordinates.longitude],[placeObjectArray[1].coordinates.latitude, placeObjectArray[1].coordinates.longitude]]);
      }else{
        arr.push([{latitude: placeObjectArray[i-1].coordinates.latitude, longitude: placeObjectArray[i-1].coordinates.longitude},{latitude: placeObjectArray[i].coordinates.latitude, longitude: placeObjectArray[i].coordinates.longitude}]);
        //console.log( arr.concat([{latitude: placeObjectArray[i-1].coordinates.latitude, longitude: placeObjectArray[i-1].coordinates.longitude},{latitude: placeObjectArray[i].coordinates.latitude, longitude: placeObjectArray[i].coordinates.longitude}]));
      }
    }
    console.log(arr);
    resetState();
    var arr2 = [];
    for (var i = 1; i<pathArr.length;i++){
      arr2.push({
        latitude: placeObjectArray[i].coordinates.latitude,
        longitude: placeObjectArray[i].coordinates.longitude
      });
    }
    console.log(arr2);
	console.log(distance, time);
    
	var t = 0.0; 
	var d = 0.0;
    setPathArr(arr.map((path, index)=>{console.log("index: ", index, path[0], path[1]); return (
	<MapViewDirections key = {Math.random()}  mode= {'WALKING'} origin={path[0]} destination={path[1]} apikey={config.apiKey} onStart={(params) => {
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
      console.log('GOT AN ERROR');
    }}></MapViewDirections>)})); // fix this fucking distance shit
    console.log("time: ", t,"distance: ", distance);
    // console.log(o ,d);
    // setPathArr([<MapViewDirections apikey={config.apiKey} origin={o} destination={d} waypoints={arr2} onStart={(params) => {
    //   console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
    // }}
    // onReady={result => {
    //   console.log(`Distance: ${result.distance} km`)
    //   console.log(`Duration: ${result.duration} min.`)
    // }}
    // onError={(errorMessage) => {
    //   // console.log('GOT AN ERROR');
    // }}></MapViewDirections>]);
    
    
  }
  const onPressFunction = (index) =>{
    console.log("pressed");
    console.log("index: " , index);
    var arr2 = placeObjectArray;
    if (arr2.length > 1){
      console.log("whi")
      arr2.splice(index,1);
    }else{
      console.log("hi")
      arr2 = [];
    }
    

    
    //delete arr[index];
    console.log(arr2, "\n\n\n");
    setPlaceObjectArray([...arr2]);
    const options = {
      edgePadding: EDGE_PADDING,
      animated: true
    }
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
          <View style={{
            width: "100%",
            
          }}>
            <ScrollView centerContent={true}  horizontal={true} style={{ 
					width: '100%',
					
					
                	
				}} keyboardShouldPersistTaps='always'> 
              <GooglePlacesAutocomplete
                  placeholder="Type a place"
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
        {location !== null ? 
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
          {/* {markerArray} */}
        </MapView>) : null}
		</View>
        <Pressable onPress={handlePress} style={{
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
		}}>
			<Text style={{
				 fontSize: 16,
				 lineHeight: 21,
				 fontWeight: 'bold',
				 letterSpacing: 0.25,
				 color: 'white',
			}}>
				Show Routes
			</Text>
		</Pressable>
         
        <Text style={{fontSize: 18,
				margin: 5,
				padding: 5,
				lineHeight: 21,
				fontWeight: 'bold',
				letterSpacing: 0.25,
				color: 'white',}}> 
				Time Required: {Math.round(time)} minutes
				{/* Time Required: {time} */}
			 </Text>
			 <Text style={{fontSize: 18,
				margin: 5,
				padding: 5,
				lineHeight: 21,
				fontWeight: 'bold',
				letterSpacing: 0.25,
				color: 'white',}}> 
				Jogged: {distance*0.621371} miles
			 </Text>
        <ScrollView  style={{
			width: "100%",
			height: "45%",
			
			
		}}>
          {placeObjectArray.map((placeObject,index)=>(
          <View key={index} style={{padding:10}}>
            <Pressable onLongPress={() => (onPressFunction(index))} style={{
				borderColor: "#FFA782",
				borderBottomWidth: 3,
				borderRightWidth: 4,
				borderRadius: 16,
				backgroundColor: "#EF5B5B",
				shadowColor: '#171717',
				shadowOffset: {width: 2, height: 3},
				shadowOpacity: 0.4,
				shadowRadius: 2,

			}}>
              <Text style={{
				fontSize: 18,
				margin: 5,
				padding: 5,
				lineHeight: 21,
				fontWeight: 'bold',
				letterSpacing: 0.25,
				color: 'white',
			  }}>{placeObject.description}</Text>

            </Pressable>
          </View>
          
          ))}
        </ScrollView>
        
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 2, // the number of columns you want to devide the screen into
    marginHorizontal: 10,
    width: 400,
    height: 800,
  },
  row: {
    height: 200,
    flexDirection: "row",
    
  },
  pic: {
    marginHorizontal: 17,
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
  text: {
    textAlign: "center",
    borderWidth: 1,
  },
  "2col": {
    backgroundColor: "white",
    borderColor: "#fff",
    borderWidth: 5,
    flex: 2,
    borderRadius: 16,
    marginHorizontal: 7,
    marginTop: 22,
    height: "90%",
    padding: 20,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 9,
    
  },
  gridHeader: {
    fontSize: 24,
    fontFamily: "GillSans-BoldItalic",
    marginTop: 10,
    color: "#093D59",
  },

  cardContainer: {
    backgroundColor: "#093D59",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 500,
    alignItems: "center",
    justifyContent: "start",
    shadowColor: "#000",
    shadowOffset: {
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 9,
  },
  container: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "start",
    
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
});
