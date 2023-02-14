import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from './Pages/MainPage';
import HistoryPage from './Pages/HistoryPage';



export default function App(){
  const Stack = createNativeStackNavigator();
  return (
  <NavigationContainer>
    <Stack.Navigator
     
    >
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        
      />
      <Stack.Screen
        name="HistoryPage"
        component={HistoryPage}
        
      />
      
    </Stack.Navigator>
  </NavigationContainer>
  // <MainPage></MainPage>
  )
}