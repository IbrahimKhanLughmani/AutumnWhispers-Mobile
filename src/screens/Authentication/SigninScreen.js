import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Platform, ImageBackground, Keyboard} from 'react-native'
import LoginWithGoogle from '../../components/LoginWithGoogle';
import LoginWithFacebook from '../../components/LoginWithFacebook';
import LoginWithApple from '../../components/LoginWithApple';
import { Context } from '../../context/AuthContext';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Logo from '../../asset/icons/logo/logo.svg';

const SigninScreen = ({navigation}) => {
    const {signin, removeErrorMessage} = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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
            <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={()=>{Keyboard.dismiss()}}>
                <SafeAreaView style={{flex: 1}}>
                    <Spinner visible={loading}/> 
                    {/* <View style={{flex: 0.25, justifyContent: 'center'}}>
                        <Logo style={{alignSelf: 'center'}} height={200} width={200}/>
                    </View> */}
                    <View style={{flex: 0.675, justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', marginBottom: 10}}>
                            <Text style={styles.title}>Sign In</Text>
                            <Text style={styles.subTitle}>Sign In to get started!</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                value={email}
                                style={styles.textInput} 
                                placeholder='Email'
                                autoCapitalize={'none'} 
                                placeholderTextColor='grey'
                                onChangeText={(text)=>{setEmail(text)}}/>
                            <TextInput 
                                value={password}
                                style={styles.textInput}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder='Password' 
                                placeholderTextColor='grey'
                                secureTextEntry={true}
                                onChangeText={(text)=>{setPassword(text)}}/>
                        </View>
                        <TouchableOpacity 
                            style={styles.forgetPassContainer}
                            onPress={()=>{
                                navigation.navigate('ForgetPass')
                            }}>
                            <Text style={styles.forgetPass}>Forget Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.signupButton}
                            underlayColor='#fff'
                            onPress={async()=>{
                                setLoading(true)
                                await signin(email, password, setLoading, ()=>navigation.dispatch(nav_home), ()=>navigation.dispatch(nav_liveness))
                            }}>
                                <Text style={styles.signupText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.3, justifyContent: 'center'}}>
                        <View style={{marginStart: 20, marginEnd: 20}}>
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
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center'}}>
                            <Text style={styles.signInText}>Does not have account? </Text>
                            <TouchableOpacity 
                                style={{padding: 10}}
                                onPress={()=>{
                                    navigation.navigate('Signup')
                                }}>
                                <Text style={styles.signIn}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 0.025, justifyContent: 'center'}}>
                        <Text style={styles.version}>Version 1.7.1</Text>
                    </View>
                </SafeAreaView>
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
    terms: {
        color: 'silver',
        textDecorationLine: 'underline'
    },
    signupButton: {
        justifyContent: 'center',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        height: 45,
        backgroundColor: '#58a279',
        borderRadius: 10,
    },
    signupText: {
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
    ver: {
        fontSize: 12,
        color: '#58a279',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center'
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
    forgetPassContainer: {
        alignSelf: 'flex-end', 
        marginEnd: 20
    },
    forgetPass: {
        color: '#58a279', 
        fontSize: 12,
        textDecorationLine: 'underline',
        padding: 10
    },
    signInText: {
        color: 'black',
    },
    signIn: {
        color: '#58a279',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    version: {
        fontSize: 12,
        color: 'grey',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center'
    },
});

export default SigninScreen;