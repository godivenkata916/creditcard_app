import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  Animated,
  Alert
} from 'react-native';
import axios from 'axios';

const CardTypes={
  visa:{
    name:"Visa",
    pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
    image:require('./assets/visa.png'),
  },
  mastercard:{
    name:"Mastercard",
    pattern:/^5[1-5][0-9]{14}$/,
    image:require('./assets/mastercard.png'),
  },
  americanexpress:{
    name:"American Express",
    pattern: /^3[47][0-9]{13}$/,
    image:require('./assets/amex.png'),
  },
  dinersclub:{
    name:"Dinersclub",
    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    image:require('./assets/dinersclub.png'),
  },
  discover:{
    name:"Discover",
    pattern: /^(?:6011|65[0-9]{2}|64[4-9][0-9])[0-9]{12}(?:[0-9]{3})?$/,
    image:require('./assets/discover.png'),
  },
  troy:{
    name:"Troy",
    pattern: /^(?:9792[0-9]{12})$/,
    image:require('./assets/troy.png'),
  },
  jcb:{
    name:"Jcb",
    pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
    image:require('./assets/jcb.png'),
  },
  unionpay:{
    name:"Unionpay",
    pattern: /^(62[0-9]{14,17})$/,
    image:require('./assets/unionpay.png'),
  },
}

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardType, setCardType] = useState('');
  const flipAnimation = useRef(new Animated.Value(0)).current;

  

  const handleCardNumberChange = (value:any) => {
    setCardNumber(value);
    detectvalue(value);
  };

  const handleCardHolderNameChange = (text:any) => {
    setCardHolderName(text);
  };

  const handleExpiryMonthChange = (text:any) => {
    setExpiryMonth(text);
  };

  const handleExpiryYearChange = (text:any) => {
    setExpiryYear(text);
  };

  // const handleCVVChange = (text:any) => {
  //   setCVV(text);
  // };
  const handleCVVChange = (value:any) => {
    const cleanedValue = value.replace(/\D/g, '');

    const truncatedValue = cleanedValue.slice(0, 3);

    setCVV(truncatedValue);
  };

  const maskedCVV = cvv.length === 3 ? '***' : cvv;

  const handleCVVFocus = () => {
    setIsFlipped(true);
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCVVBlur = () => {
    setIsFlipped(false);
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = async () => {
    // Perform validation and submission logic here
     // Perform client-side validations
     if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // Perform server-side validation
    try {
      const response = await axios.post('http://localhost:3000/credit-cards/validate', {
        cardNumber,
        cardHolderName,
        expiryMonth,
        expiryYear,
        cvv,
      });

      if (response.data.isValid) {
        // Card is valid, submit the form or perform further actions
        Alert.alert('Card is valid');
      } else {
        // Card is invalid, display appropriate error message
        Alert.alert('Card is invalid: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const detectvalue = (value:any) => {
    let type = '';
    for (const card in CardTypes) {
      if (value.match(CardTypes[card].pattern)) {
        type = card;
        break;
      }
    }
    setCardType(type);
  };

  const maskCardNumber = (cardNumber:any) => {
    const visibleDigits = 4;
    const masked = cardNumber.replace(/\d/g, (match:any, index:any) => {
      if (index < visibleDigits || index >= cardNumber.length - visibleDigits) {
        return match;
      } else {
        return '#';
      }
    });
    return masked.replace(/(.{4})/g, '$1 ');
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.card}>
                <View style={styles.cardHeader}>
                <Animated.View
              style={[
                styles.cardContent,
                isFlipped && styles.cardContentFlipped,
                frontAnimatedStyle,
              ]}
            >
              <ImageBackground
                source={require('./assets/4.jpeg')}
                imageStyle={{
                  width: 270,
                  height: 170,
                  borderRadius: 10,
                  borderColor: 'black',
                  borderWidth: 0.5,
                }}
                style={styles.cardBackground}
              >
                  <View style={styles.con}>
                    <Image
                      source={require('./assets/chip.png')}
                      style={styles.img1}
                    />
                    <Image
                      source={CardTypes[cardType]?.image || require('./assets/visa.png')}
                      style={styles.img2}
                      resizeMode="stretch"
                    />
                  </View>
                  {cardNumber ? (
                    <Text style={styles.cardNumberText}>{maskCardNumber(cardNumber)}</Text>
                  ) : (
                    <Text style={styles.cardNumberPlaceholder}>
                      {'#'.repeat(16)}
                    </Text>
                  )}
                  <View style={{flexDirection:"row",justifyContent:'space-between',marginTop:"5%"}}>
                <Text style={{fontSize:15,paddingLeft:18,color:"white",}}>Card Holder</Text>
                <Text style={{fontSize:15,paddingRight:20,color:"white",}}>Expires</Text>
            </View>
                <View style={{flexDirection:"row",justifyContent:'space-between',}}>
                <Text style={{height:30,width:"50%",fontSize:20,color:"white",padding:15,paddingVertical:5,}}>{cardHolderName.toUpperCase()}</Text>

                    {expiryYear||expiryMonth ? <Text style={{height:30,fontSize:15,color:"white",padding:15,paddingVertical:3}}>{expiryMonth}/{expiryYear}</Text>
                    :<Text style={{height:30,fontSize:15,color:"white",padding:15,paddingVertical:3}}>MM/YY</Text>}
                </View>
                
                </ImageBackground>
                </Animated.View>
                </View>
              
            
            <Animated.View
              style={[
                styles.cardContent,
                isFlipped && styles.cardContentFlipped,
                backAnimatedStyle,
              ]}
            >
              <ImageBackground
                source={require('./assets/4.jpeg')}
                imageStyle={{
                  width: 270,
                  height: 170,
                  borderRadius: 10,
                  borderColor: 'black',
                  borderWidth: 0.5,
                }}
                style={styles.cardBackground}
              >
                <View
            style={{
              height: 30,
              width:270,
              marginTop: '10%',
              backgroundColor: 'black',
            }}>
            </View>
            <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginTop: '8%',
            }}>
            <Text style={styles.cvvDef}>CVV</Text>
          </View>
                <View style={styles.cvvView}>
                  <Text style={styles.Cvv}>{maskedCVV}</Text>
                </View>
                <View style={{alignItems:'flex-end',marginTop:-7,}}>
                <Image
                      source={CardTypes[cardType]?.image || require('./assets/visa.png')}
                      style={{height: 29, width: 60, padding: 15,borderRadius: 2,marginRight: 15,marginTop: 10,}}
                      resizeMode="stretch"
                    />
                    </View>
              </ImageBackground>
            </Animated.View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor="#ccc"
                keyboardType='numeric'
                value={cardNumber}
                onChangeText={handleCardNumberChange}
              />

              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                placeholderTextColor="#ccc"
                value={cardHolderName}
                onChangeText={handleCardHolderNameChange}
              />
              <View style={styles.input1}>
                <TextInput
                  style={styles.input2}
                  placeholder="Month"
                  placeholderTextColor="#ccc"
                  keyboardType='numeric'
                  value={expiryMonth}
                  onChangeText={handleExpiryMonthChange}
                />
                <TextInput
                  style={styles.input3}
                  placeholder="Year"
                  placeholderTextColor="#ccc"
                  keyboardType='numeric'
                  value={expiryYear}
                  onChangeText={handleExpiryYearChange}
                />
                <TextInput
                  style={styles.input4}
                  placeholder="CVV"
                  placeholderTextColor="#ccc"
                  value={cvv}
                  keyboardType='numeric'
                  maxLength={3}
                  onChangeText={handleCVVChange}
                  onFocus={handleCVVFocus}
                  onBlur={handleCVVBlur}
                  secureTextEntry
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: '#ffffff',
    color: 'black',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  cardContent: {
    backfaceVisibility: 'hidden',
  },
  cardContentFlipped: {
    position: 'absolute',
    top: 3,
    left:15,
  },
  cardBackground: {
    flex: 1,
  },
  cardHeader: {
    // position: 'absolute',
    // top: 3,
    // left:15,
    marginBottom:0,
    marginTop:0,
  },
  cardNumberText: {
    height: 35,
    fontWeight: 'bold',
    color: 'white',
    // marginTop: 25,
    // marginBottom: 10,
    padding: 15,
    paddingVertical: 5,
  },
  cardNumberPlaceholder: {
    height: 35,
    fontWeight: 'bold',
    color: 'white',
    // marginTop: 25,
    // marginBottom: 10,
    padding: 15,
    paddingVertical: 5,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  cardHolderText: {
    fontSize: 15,
    paddingLeft: 18,
    color: 'white',
  },
  expiryText: {
    fontSize: 15,
    paddingRight: 20,
    color: 'white',
  },
  cvvText: {
    height: 35,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 25,
    marginBottom: 10,
    padding: 15,
    paddingVertical: 5,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop:160,
    marginBottom: 0,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    color: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input1: {
    flexDirection: 'row',
    
  },
  input2: {
    flexDirection: 'row',
    width: 80,
    height: 40,
    color: 'black',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 5,
  },
  input3: {
    flexDirection: 'row',
    width: 80,
    color: 'black',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 5,
  },
  input4: {
    flexDirection: 'row',
    width: 97,
    height: 40,
    borderColor: '#ccc',
    color: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  img1: {
    width: 30,
    height: 24,
    marginLeft: 15,
    marginTop: 15,
  },
  img2: {
    width: 50,
    height: 27,
    marginRight: 15,
    marginTop: 16,
  },
  cvvDef: {
    fontSize: 15,
    paddingHorizontal: 20,
    paddingVertical: 3,
    color: 'white',
  },
  cvvView: {
    height: 28,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  Cvv: {color: 'black', fontSize: 20, paddingRight: 15},
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CreditCardForm;
