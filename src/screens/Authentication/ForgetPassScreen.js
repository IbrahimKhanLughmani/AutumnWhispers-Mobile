import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Context } from '../../context/AuthContext';

const ForgetPassScreen = ({navigation}) => {
  const {forgetPass, removeErrorMessage} = useContext(Context);
  const [email, setEmail] = useState('');

  useEffect( async () => {
    navigation.addListener('didFocus', async() => {
        removeErrorMessage()    
    });
    removeErrorMessage()    
  }, []);

  return(
    <View style={{flex: 1, marginTop: 40}}>
        <View style={{alignItems: 'center', padding: 20}}>
          <Text style={styles.title}>Forget Password?</Text>
          <Text style={styles.subTitle}>No problem, let's reset it.</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            value={email}
            style={styles.textInput} 
            placeholder='Email' 
            placeholderTextColor='grey'
            autoCapitalize={'none'}
            onChangeText={(newText)=>{setEmail(newText)}}
          />
        </View>
        <TouchableOpacity
          style={styles.resetButton}
          underlayColor='#fff'
          onPress={()=>{
            forgetPass(email, ()=>navigation.navigate('ResetPassVer', {email: email}))
          }}>
              <Text style={styles.resetText}>Send Verification Code</Text>
        </TouchableOpacity>
    </View>
    )
};

const styles = StyleSheet.create({
  title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'black'
  },
  subTitle: {
      color: 'black',
      marginBottom: 10,
  },
  textInputContainer: {
      marginStart: 20,
      marginEnd: 20,
  },
  textInput: {
      borderColor: 'silver',
      borderWidth: 0.5,
      paddingStart: 15,
      paddingEnd: 15,
      height: 40,
      borderRadius: 5,
      color: 'black',
      marginTop: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  resetButton: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 20,
      height: 45,
      backgroundColor: '#58a279',
      borderRadius: 10,
  },
  resetText: {
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
  },
});

export default ForgetPassScreen;