import { StyleSheet, Dimensions } from "react-native";
export const styles = StyleSheet.create({
    text: {
      textAlign: "center",
      borderWidth: 1,
    },
    map: {
      width: Dimensions.get("window").width - 30,
      height: Dimensions.get("window").height / 2 - 120,
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
      marginHorizontal: 10,
      marginVertical: 3,
      padding: 2,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    showRoutesPressable: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      paddingHorizontal: 5,
      marginHorizontal: 10,
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
    },
    historyPressableStyle:{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      borderColor: "#C6ECAE",
      borderBottomWidth: 3,
      borderRightWidth: 4,
      borderRadius: 16,
      backgroundColor: "#5DA271",
      shadowColor: '#171717',
      shadowOffset: {width: 2, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      marginVertical: 6,
      marginHorizontal: 10,
      
    }
  
    
  });

  export const headerOptions = {
    headerStyle:{
      backgroundColor:"#FFBC42",
      //borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: "white",
    },
    headerTintColor: "white",
    headerBackTitleStyle:{
      fontSize: 14,
    },
    headerBackTitleVisible:false,
    headerShadowVisible: false,
    
  }