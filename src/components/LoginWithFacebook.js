import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {Context} from '../context/AuthContext';
import SVG from '../asset/icons/social_login/facebook.svg';

export default LoginWithFacebook = ({navigation, nav_home, nav_liveness, setLoading}) => {
    const {socialLogin} = useContext(Context);

    async function initUser(token) {
        await fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture.type(large)&access_token=' + token)
        .then((response) => response.json())
        .then((json) => {
            setLoading(true)
            var fields = json.name.split(' ');
            var firstname = fields[0];
            var lastname = fields[1];
            socialLogin(json.email, 'password', firstname, 'password', '', '', 'social', lastname, json.picture.data.url, nav_home, nav_liveness, setLoading)
        })
        .catch(() => {
          reject('ERROR GETTING DATA FROM FACEBOOK')
        })
    }
    
    function signIn() {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(function (result) {
        if (result.isCancelled) {
            console.log("Login Cancelled " + JSON.stringify(result))
        } 
        else {
            setLoading(true);
            AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data
                console.log(accessToken)
                initUser(accessToken)
            })
        }
    },
    function (error) {
        console.log("Login failed with error: " + error);
    })
    }

    return(
        <View>    
            <TouchableOpacity 
                style={styles.facebookContainer}
                onPress={()=>{
                    signIn()
                }}>
                <View style={{flex: 0.3, alignItems: 'flex-end', justifyContent: 'center', marginEnd: 10}}>
                    <SVG style={styles.icon}/>
                </View>
                <View style={{flex: 0.7, alignItems: 'flex-start', justifyContent: 'center', marginStart: 10}}>
                    <Text style={styles.loginWithFBText}>Sign in with Facebook</Text>                      
                </View>
            </TouchableOpacity>       
        </View>
    )
};

const styles = StyleSheet.create({
    facebookContainer: {
        flexDirection: 'row', 
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        height: 40, 
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: 'silver'
    },
    loginWithFBText:{
        color: '#343c71',
    },
    icon: {
        height: 30, 
        width: 30
    }
});