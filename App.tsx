/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

import CreditCardForm from './android/app/src/formcard';
// import Creditcard from './android/app/src/creditcard';


const App=()=>{


  return(
    <View>
      {/* <Creditcard /> */}
      <CreditCardForm />
    </View>
  )
}
 
export default App;
