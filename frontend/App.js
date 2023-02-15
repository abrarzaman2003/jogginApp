import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from './Pages/MainPage';
import HistoryPage from './Pages/HistoryPage';
import { headerOptions } from './Styles/StyleSheet';




export default function App(){
  const Stack = createNativeStackNavigator();
  return (
  <NavigationContainer>
    <Stack.Navigator
     
    >
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        initialParams={{ placeObjectArray: [] }}
        options={{...headerOptions, title:"Joggin Routes"}}
      />
      <Stack.Screen
        name="HistoryPage"
        component={HistoryPage}
        options={{...headerOptions, title:"Joggin History"}}
      />
      
    </Stack.Navigator>
  </NavigationContainer>
  // <MainPage></MainPage>
  )
}