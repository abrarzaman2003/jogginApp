import { StyleSheet, Input, Text, View, SafeAreaView, ScrollView, Dimensions, Button, Pressable } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { styles } from '../Styles/StyleSheet';

export default function HistoryPage( {navigation }){
    const baseUrl = "http://192.168.1.194:8081";
    const getRoutes = async () =>{
        axios.get(`${baseUrl}/api/getAllRoutes`).then((response) => {
            // console.log(response.data);
            return response.data;
        })
    }
    const [routesArray, setRoutesArray] = useState([]);
    useEffect(()=>{
        axios.get(`${baseUrl}/api/getAllRoutes`).then((response) => {
            console.log("asddasf");
            setRoutesArray( response.data)
        })
    },[]);
    return (
        <SafeAreaView style={{backgroundColor:"#FFBC42", flex:1}}>
            <ScrollView>
            <Pressable key={Math.random()} style={styles.placesPressable} onPress={()=>{
                        navigation.navigate('MainPage', {
                            placeObjectArray: []
                        })
                    }}>
                        <Text style={styles.placesPressableText}> 
                            Start a new Route!
                        </Text>
                    </Pressable>
                { routesArray.map((route,index)=>{
                    return (<Pressable key={Math.random()} style={styles.historyPressableStyle} onPress={()=>{
                        navigation.navigate('MainPage', {
                            placeObjectArray: route.object
                        })
                    }}>
                        <View>
                        <Text style={styles.placesPressableText}> 
                            Date: {route.id}
                        </Text>
                        <Text style={styles.placesPressableText}>
                            Time: {Math.round(route.totalDuration)} minutes
                        </Text>
                        <Text style={styles.placesPressableText}>
                            Jogged: {Math.round((route.totalDistance*0.621371) * 100)/100} miles
                        </Text>
                        </View>
                        
                        </Pressable>)
                })
                }
            </ScrollView>
        </SafeAreaView>
        
    );
    
}
