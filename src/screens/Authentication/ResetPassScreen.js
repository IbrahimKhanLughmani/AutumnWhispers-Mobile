import React, {useContext, useState} from 'react';
import {ImageBackground, Text, StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import { Context } from '../../context/AuthContext';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';

const ResetPassScreen = ({navigation}) => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Signin' })],
    });
    const {resetPass} = useContext(Context);
    const [password, setPassword] = useState('');
    const [confirm_pass, setConfirm_pass] = useState('');

    const resetPassword = () => {
      if(password === confirm_pass){
        resetPass(password, ()=>navigation.dispatch(resetAction))
      } 
      else {
        Toast.show('Password and confirm password does not match', Toast.LONG);
        setPassword('')
        setConfirm_pass('')
      }
    }

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Yay! It's you</Text>
        <Text style={styles.title}>Reset your password</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          value={password}
          style={styles.textInput} 
          placeholder='New Password' 
          placeholderTextColor='grey'
          autoCapitalize={'none'}
          secureTextEntry={true}
          onChangeText={(newText)=>{setPassword(newText)}}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          value={confirm_pass}
          style={styles.textInput} 
          placeholder='Confirm Password' 
          placeholderTextColor='grey'
          autoCapitalize={'none'}
          secureTextEntry={true}
          onChangeText={(newText)=>{setConfirm_pass(newText)}}
        />
      </View>
      <TouchableOpacity
        style={styles.signupButton}
        underlayColor='#fff'
        onPress={()=>{
          resetPassword()
        }}>
            <Text style={styles.signupText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 20
    },
    titleContainer: {
      marginTop: 40,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'black',
      alignSelf: 'center',
    },
    signupButton: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 40,
      height: 45,
      backgroundColor: '#58a279',
      borderRadius: 10,
    },
    signupText: {
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
    },
    textInputContainer: {
      marginStart: 20,
      marginEnd: 20,
    },
    textInput: {
      borderWidth: 0.5,
      borderColor: 'silver',
      paddingStart: 15,
      paddingEnd: 15,
      height: 40,
      borderRadius: 5,
      color: 'black',
      marginTop: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default ResetPassScreen;