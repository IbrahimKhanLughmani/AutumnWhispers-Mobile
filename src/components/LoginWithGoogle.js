import React, {useContext, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import {Context} from '../context/AuthContext';
import SVG from '../asset/icons/social_login/google.svg';

export default LoginWithGoogle = ({navigation, nav_home, nav_liveness, setLoading}) => {
    const {socialLogin, googleSignOut} = useContext(Context);

    useEffect(() => {
        navigation.addListener('didFocus', async() => {
            googleSignOut()
        })
        googleSignOut()
    });

    GoogleSignin.configure({
        webClientId: '645251019138-vhsacqk7du9b41b2q8lqch99g0jb7qp7.apps.googleusercontent.com',
        offlineAccess: true
    });

    const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          await GoogleSignin.signIn()
          .then(async(res)=>{
            setLoading(true)
            if(res.user.photo === null || res.user.photo === undefined){
                await socialLogin(res.user.email, 'password', res.user.givenName, 'password', '', '', 'social', res.user.familyName, '', setLoading, nav_home, nav_liveness)
            }
            else{
                await socialLogin(res.user.email, 'password', res.user.givenName, 'password', '', '', 'social', res.user.familyName, res.user.photo, setLoading, nav_home, nav_liveness)
            }
          })
        } catch (error) {
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("You cancelled the sign in.");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("Google sign In operation is in process");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("Play Services not available");
            } else {
                console.log("Something unknown went wrong with Google sign in. " + error.message);
            }
        }
    }

    return(
        <View>          
            <TouchableOpacity 
                style={styles.googleContainer}
                onPress={()=>{
                    signIn()
                }}
                >
                <View style={{flex: 0.3, alignItems: 'flex-end', justifyContent: 'center', marginEnd: 10}}>
                    <SVG style={styles.icon}/>
                </View>
                <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center', marginStart: 10}}>
                    <Text style={styles.loginWithGoogleText}>Sign in with Google</Text>                      
                </View>
            </TouchableOpacity>
           
        </View>
    )
};

const styles = StyleSheet.create({
    googleContainer: {
        flexDirection: 'row', 
        height: 40, 
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 5, 
        borderWidth: 0.5,
        borderColor: 'silver'
    },
    loginWithGoogleText:{
        color: '#343c71',
    },
    icon: {
        height: 30, 
        width: 30
    }
});