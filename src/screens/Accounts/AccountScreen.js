import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Linking, Image} from 'react-native';
import AccountNav from '../../components/AccountNav';
import AccountScreenComponent from '../../components/AccountScreenComponent';
import {Context} from '../../context/AuthContext';
import SVGInvitation from '../../assets/profile/invitation.svg';
import SVGLiveness from '../../assets/profile/eye.svg';
import SVGSubscription from '../../assets/profile/subscription.svg';
import SVGPolicy from '../../assets/profile/policy.svg';
import SVGAboutUs from '../../assets/profile/aboutus.svg';
import SVGContactUs from '../../assets/profile/contactus.svg';
import SVGNext from '../../assets/profile/next.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';

const AccountScreen = ({navigation}) => {
    const {signout, googleSignOut} = useContext(Context)
    const [image, setImage] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const nav_home = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Signin' })],
    });

    useEffect(async() => {
      setFirstName(await AsyncStorage.getItem('F_Name'))
      setLastName(await AsyncStorage.getItem('L_Name'))
      setEmail(await AsyncStorage.getItem('Email'))
      setImage(await AsyncStorage.getItem('Profile_Pic'))
      setLoaded(true)
    }, []);

    Signout = async () => {
        setLoading(true)
        await signout(() => navigation.dispatch(nav_home))
        await googleSignOut()
        setLoading(false)
    };

    const loadContent = () => {
      if(loaded === true){
        return(
          <View style={{flex: 1}}>
            <View style={{flex: 0.9}}>
              <TouchableOpacity 
                style={styles.infoContainer}
                onPress={()=>{
                  navigation.navigate('EditAccount')
                }}>
                <View style={styles.imageContainer}>
                  {
                    image ?
                    <Image style={styles.profile_pic} source={{uri: image}}/> :
                    <Image style={styles.img} source={require('../../assets/profile/profile.png')}/>
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
                    const Contact = await AsyncStorage.getItem('Contact')
                    if(Contact === null){
                      navigation.navigate('EditAccount')
                      Toast.show('Please add contact number', Toast.LONG);
                    }
                    else{
                      navigation.navigate('Invitation')
                    }
                  }}  
                />
                <AccountScreenComponent 
                  name="Liveness Detection" 
                  SVG={SVGLiveness}
                  callback={()=>{
                    navigation.navigate('Liveness')
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
                  name="Privacy Policy" 
                  SVG={SVGSubscription}
                  callback={async()=>{
                    await Linking.openURL('https://autumn-whispers.com/privacy-notice');
                  }}  
                />
                <AccountScreenComponent 
                  name="About us" 
                  SVG={SVGAboutUs}
                  callback={()=>{
                    navigation.navigate('About')
                  }} 
                />
                <AccountScreenComponent 
                  name="Contact us" 
                  SVG={SVGContactUs}
                  callback={()=>{
                    navigation.navigate('Contactus')
                  }} 
                />
              </View>
            </View>
            <View style={{flex: 0.1}}>
                <AccountNav />
            </View>
          </View>
        )
      }
    };

    return(
        <>
          {
            loadContent()
          }
          <Spinner visible={loading}/>
        </>
    )
};

const styles = StyleSheet.create({
  headerContainer: {
    marginStart: 20
  },
  infoContainer: {
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: 'silver',
  },
  imageContainer: {
    flex: 0.2, 
    borderRadius: 15, 
    margin: 20,
    paddingEnd: 20,
  },
  img: {
    height: 75, 
    width: 75
  },
  profile_pic: {
    height: 80, 
    width: 80,
    borderRadius: 20,
  },
  nameContainer: {
    flex: 0.7, 
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
    fontWeight: 'bold'
  },
  email: {
    color: 'grey', 
    fontSize: 12
  },
  logout: {
    color: 'green',
    marginEnd: 20,
  },
    
});

AccountScreen.navigationOptions = () => ({
    title: '',
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          // backButtonPressed()
        }}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>My account</Text>
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
            Signout()
        }}>
        <Text style={styles.logout}>Log out</Text>
      </TouchableOpacity>
    ),
})

export default AccountScreen;