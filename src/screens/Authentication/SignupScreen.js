import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, ImageBackground, SafeAreaView} from 'react-native'
import LoginWithFacebook from '../../components/LoginWithFacebook';
import LoginWithGoogle from '../../components/LoginWithGoogle';
import LoginWithApple from '../../components/LoginWithApple';
import PhoneInput from 'react-native-phone-number-input';
import { Context } from '../../context/AuthContext';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

const SignupScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [c_code, setC_Code] = useState('IE');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {state, signup, removeErrorMessage} = useContext(Context);
    const nav_home = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    const nav_liveness = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'VerifyDetection', params: {root_nav: 'Login'} })],
    });

    useEffect( async () => {
        navigation.addListener('didFocus', async() => {
            setLoading(false)
            removeErrorMessage()    
        });
        removeErrorMessage()    
    }, []);

    const renderAppleButton = () => {
        if(Platform.OS === 'ios'){
            return(
                <LoginWithApple 
                    navigation={navigation}
                    nav_home={()=>navigation.dispatch(nav_home)}
                    nav_liveness={()=>navigation.dispatch(nav_liveness)}
                    setLoading={setLoading}
                />
            )
        }
    };

    return(
    <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
        <Spinner visible={loading}/> 
            <View style={{flex: 0.7, justifyContent: 'center'}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subTitle}>Sign Up to get started!</Text>
                    <Text style={styles.passDesc}>Password must be atleast 10 characters and contain atleast one special character and one uppercase character</Text>
                </View>
                <View 
                    style={styles.textInputContainer}>
                    <TextInput
                        value={firstName}
                        style={styles.textInput} 
                        placeholder='First Name' 
                        placeholderTextColor='grey'
                        autoCorrect={false}
                        onChangeText={(newText)=>{setFirstName(newText)}}    
                    />
                    <TextInput
                        value={lastName}
                        style={styles.textInput} 
                        placeholder='Last Name' 
                        placeholderTextColor='grey'
                        autoCorrect={false}
                        onChangeText={(newText)=>{setLastName(newText)}}    
                    />
                    <PhoneInput
                        value={contact}
                        defaultCode={c_code}
                        layout="first"
                        containerStyle={styles.phoneContainer}
                        textContainerStyle={styles.textInputPhone}
                        onChangeCountry={text => {
                            setC_Code(text.cca2);
                        }}
                        onChangeText={text => {
                            setContact(text);
                        }}
                    /> 
                    <TextInput
                        value={email}
                        style={styles.textInput} 
                        placeholder='Email' 
                        placeholderTextColor='grey'
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={(newText)=>{setEmail(newText)}}    
                    />
                    <TextInput
                        value={password}
                        style={styles.textInput} 
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        placeholder='Password' 
                        placeholderTextColor='grey'
                        secureTextEntry={true}
                        onChangeText={(newText)=>{setPassword(newText)}}    
                    />
                </View>
                <TouchableOpacity
                    style={styles.signupButton}
                    underlayColor='#fff'
                    onPress={()=>{
                        setLoading(true)
                        signup(email, password, firstName, password, c_code, contact, 'normal', lastName, '', setLoading, ()=>navigation.navigate('Verification', {email: email}))
                    }}>
                        <Text style={styles.signupText}>Sign up</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                    <Text>By signing up you agree to the </Text>
                    <TouchableOpacity onPress={async()=>{
                        await Linking.openURL('https://autumn-whispers.com/terms-of-use');
                    }}>
                        <Text style={styles.terms}>Terms of use</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 0.3, justifyContent: 'center', marginStart: 20, marginEnd: 20, marginTop: 20}}>
                <View>
                    <LoginWithGoogle
                        navigation={navigation}
                        nav_home={()=>navigation.dispatch(nav_home)}
                        nav_liveness={()=>navigation.dispatch(nav_liveness)}
                        setLoading={setLoading}
                    />
                    <LoginWithFacebook 
                        navigation={navigation}
                        nav_home={()=>navigation.dispatch(nav_home)}
                        nav_liveness={()=>navigation.dispatch(nav_liveness)}
                        setLoading={setLoading}
                    />
                    {
                        renderAppleButton()
                    }
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', margin: 20, alignItems: 'center'}}>
                    <Text style={styles.signInText}>Already have an account? </Text>
                    <TouchableOpacity 
                        style={{padding: 10}}
                        onPress={()=>{
                            navigation.navigate('Signin')
                        }}>
                        <Text style={styles.signIn}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        marginTop: 10,
      },
      passDesc: {
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
        marginStart: 20,
        marginEnd: 20,
        marginTop: 5,
      },
      terms: {
          color: '#58a279',
          textDecorationLine: 'underline'
      },
      signupButton:{
        justifyContent: 'center',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        height: 45,
        backgroundColor: '#58a279',
        borderRadius: 10,
      },
      signupText:{
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
      password: {
        paddingStart: 10,
        paddingEnd: 10,
        height: 50,
        color: 'black',
      },
      signInText: {
          color: 'black'
      },
      signIn: {
          fontSize: 15,
          color: '#58a279',
          fontWeight: 'bold',
          textDecorationLine: 'underline'
      },
      phoneContainer: {
        borderWidth: 0.5,
        borderColor: 'silver',
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginTop: 10,
        borderRadius: 5
      },
      textInputPhone: {
        paddingVertical: 0,
        color: 'black',
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0)',
      }
});

export default SignupScreen;