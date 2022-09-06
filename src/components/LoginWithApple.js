import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Context} from '../context/AuthContext';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from "jwt-decode";

export default LoginWithApple = ({navigation, nav_home, nav_liveness, setLoading}) => {
    const {socialLogin} = useContext(Context);

    useEffect( async () => {
        return appleAuth.onCredentialRevoked(async () => {
            console.warn('If this function executes, User Credentials have been Revoked');
        });   
    }, []);

    const onAppleButtonPress = async () => {
        try {
                // performs login request
                const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });
            // get current authentication state for user
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            // use credentialState response to ensure the user is authenticated
            if (credentialState === appleAuth.State.AUTHORIZED) {
                const dataDecode = jwt_decode(appleAuthRequestResponse.identityToken);
                setLoading(true)
                if(appleAuthRequestResponse.fullName.givenName === null || appleAuthRequestResponse.fullName.familyName === null){
                    await socialLogin(dataDecode.email, 'password', dataDecode.email, 'password', '', '', 'social', dataDecode.email, '', setLoading, nav_home, nav_liveness)
                }
                else{
                    await socialLogin(dataDecode.email, 'password', appleAuthRequestResponse.fullName.givenName, 'password', '', '', 'social', appleAuthRequestResponse.fullName.familyName, '', setLoading, nav_home, nav_liveness)
                }
            }
       } 
        catch (error) {
            console.log(error)
        }
    }

    return(
        <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.button}
            onPress={() => onAppleButtonPress()}
        />
    )
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        marginTop: 10,
    },
});