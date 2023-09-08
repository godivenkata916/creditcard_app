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
    ImageBackground,
  } from 'react-native';

  const Creditcard=()=>{


    return(
       <View style={styles.front1}>
        <ImageBackground source={require("./assets/4.jpeg")} imageStyle={{width:250,height:150,borderRadius:10,}}>
        <Text>Card</Text>
        </ImageBackground>
       </View>    
    );
  }

  const styles=StyleSheet.create({
    // front:{
    //     width:250,
    //     height:150,
    //     flex: 1,
    //     borderRadius:10,
    //     justifyContent:"center",
    //     alignItems:"center",
    // },
    front1:{
        width:350,
        height:350,
        flex: 1,
        backgroundColor:"#ccc",
        
        marginLeft:15,
        marginTop:15,
    }
  })
  export default Creditcard