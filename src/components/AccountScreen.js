import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Linking, Image, ImageBackground, SafeAreaView} from 'react-native';
import AccountScreenComponent from '../components/AccountScreenComponent';
import {Context} from '../context/AuthContext';
import SVGInvitation from '../asset/icons/accounts/invitation.svg';
import SVGLiveness from '../asset/icons/accounts/liveness.svg';
import SVGSubscription from '../asset/icons/accounts/terms.svg';
import SVGPolicy from '../asset/icons/accounts/privacy_policy.svg';
import SVGAboutUs from '../asset/icons/accounts/star.svg';
import SVGContactUs from '../asset/icons/accounts/contact_us.svg';
import SVGLogout from '../asset/icons/accounts/logout.svg';
import SVGNext from '../assets/profile/next.svg';
import SVGBackWhite from '../asset/icons/back_white.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default AccountScreen = ({editAccountScreen, invitationScreen, livenessScreen, aboutScreen, contactScreen, setMenu, logoutScreen}) => {
    const {signout, googleSignOut} = useContext(Context)
    const [image, setImage] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(async() => {
      setFirstName(await AsyncStorage.getItem('F_Name'))
      setLastName(await AsyncStorage.getItem('L_Name'))
      setEmail(await AsyncStorage.getItem('Email'))
      setImage(await AsyncStorage.getItem('Profile_Pic'))
      setLoaded(true)
    }, []);

    const Signout = async () => {
        setLoading(true)
        await signout(() => logoutScreen())
        await googleSignOut()
        setLoading(false)
    };

    const renderHeader = () => {
      return(
          <View style={styles.headerInfoContainer}>
              <TouchableOpacity 
                style={{flex: 0.1}}
                onPress={()=>{
                    navigation.pop()
                }}>
                  <SVGBackWhite height={18} width={18}/>
              </TouchableOpacity>
              <View style={{flex: 0.8}}>
                <Text style={styles.headerText}>My Account</Text>
              </View>
              <View style={{flex: 0.1}}></View>
          </View>
      )
    };

    const loadContent = () => {
      if(loaded === true){
        return(
          <View style={{flex: 1}}>
            <View style={{flex: 0.075}}>
                { renderHeader() }
            </View>
            <View style={{flex: 0.925}}>
              <TouchableOpacity 
                style={styles.infoContainer}
                onPress={()=>{
                  editAccountScreen()
                }}>
                <View style={styles.imageContainer}>
                  {
                    image ?
                    <Image style={styles.profile_pic} source={{uri: image}}/> :
                    <Image style={styles.img} source={require('../asset/icons/profile/profile.png')}/>
                  }
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{firstname} {lastname}</Text>
                  <Text style={styles.email}>{email}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <SVGNext height={20} width={20}/>
                </View>
              </TouchableOpacity>
              <View>
                <AccountScreenComponent 
                  name="Invitation" 
                  SVG={SVGInvitation}
                  callback={async()=>{
                    var sync = await AsyncStorage.getItem('Sync')
                    if(sync != 'true'){
                      navigation.navigate('SyncContact')
                    }
                    else{
                      invitationScreen()                    
                    }
                  }}  
                />
                <AccountScreenComponent 
                  name="Liveness detection" 
                  SVG={SVGLiveness}
                  callback={()=>{
                    livenessScreen()                  
                  }}  
                />
                <AccountScreenComponent 
                  name="Terms of use" 
                  SVG={SVGPolicy}
                  callback={async()=>{
                    await Linking.openURL('https://autumn-whispers.com/terms-of-use');
                  }}  
                />
                <AccountScreenComponent 
                  name="Privacy policy" 
                  SVG={SVGSubscription}
                  callback={async()=>{
                    await Linking.openURL('https://autumn-whispers.com/privacy-notice');
                  }}  
                />
                <AccountScreenComponent 
                  name="About us" 
                  SVG={SVGAboutUs}
                  callback={()=>{
                    aboutScreen()
                  }} 
                />
                <AccountScreenComponent 
                  name="Contact us" 
                  SVG={SVGContactUs}
                  callback={()=>{
                    contactScreen()
                  }} 
                />
                <AccountScreenComponent 
                  name="Sign out" 
                  SVG={SVGLogout}
                  callback={()=>{
                    Signout()
                  }} 
                />
              </View>
            </View>
          </View>
        )
      }
    };

    return(
      <ImageBackground style={{flex: 1}} source={require('../asset/background/account_background.png')} resizeMode="cover">
        <Spinner visible={loading}/>
        <SafeAreaView style={{flex: 1}}>
          {loadContent()}
        </SafeAreaView>
      </ImageBackground>
    )
};

const styles = StyleSheet.create({
  headerInfoContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginStart: 20, 
    marginEnd: 20
  },
  headerText: {
    textAlign: 'center', 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold',
    paddingEnd: 5,
  },  
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#343c71',
  },
  imageContainer: {
    flex: 0.1, 
    borderRadius: 15, 
    marginStart: 20,
    marginEnd: 10,
    marginTop: 20,
    marginBottom: 20,
    paddingEnd: 20,
  },
  img: {
    height: 50, 
    width: 50,
    borderRadius: 100,
  },
  profile_pic: {
    height: 50, 
    width: 50,
    borderRadius: 100,
  },
  nameContainer: {
    flex: 0.8, 
    justifyContent: 'center', 
  },
  arrowContainer: {
    flex: 0.1, 
    justifyContent: 'flex-end', 
    alignItems: 'center',
    flexDirection: 'row', 
    padding: 20,
  },
  arrow: {
    height: 15,
    width: 15
  },
  name: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 22,
  },
  email: {
    color: 'silver', 
    fontSize: 12
  },
});


