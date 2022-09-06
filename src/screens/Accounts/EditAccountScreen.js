import React, {useRef, useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, SafeAreaView, ImageBackground, Keyboard} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetCamera from '../../components/BottomSheetCamera';import PhoneInput from 'react-native-phone-number-input';
import SVGEdit from '../../assets/profile/edit.svg';
import SVGBack from '../../asset/icons/back.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/UserContext';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

const EditAccountScreen = ({navigation}) => {
  const {uploadFile, updateProfile} = useContext(Context)
  const [image, setImage] = useState('');
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [c_code, setC_Code] = useState('GB')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sheetRefCamera = useRef(null)
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });

  useEffect(() => {
    loadContent()
  }, []);

  const renderContentCamera = () => (
    <BottomSheetCamera 
      sheetRefCamera={sheetRefCamera}
      setOpaque={''}
      setImage={setImage}
    />
  );

  const renderProfilePic = () => {
    if(image === null || image === undefined){
      return(
        <ImageBackground 
          style={styles.profile_pic} 
          source={require('../../assets/profile/profile.png')}
          imageStyle={{ borderRadius: 100}}>
          <TouchableOpacity 
              style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}
              onPress={()=>{
                sheetRefCamera.current.snapTo(0)
              }}>
              <SVGEdit 
                style={styles.svg}
                onPress={()=>{
                  sheetRefCamera.current.snapTo(0)
                }}
              />
            </TouchableOpacity>
        </ImageBackground>
      )
    } 
    else{
      return(
        <ImageBackground 
          style={styles.profile_pic} 
          source={{uri: image}}
          imageStyle={{ borderRadius: 100}}>
          <TouchableOpacity 
              style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}
              onPress={()=>{
                sheetRefCamera.current.snapTo(0)
              }}>
              <SVGEdit 
                style={styles.svg}
                onPress={()=>{
                  sheetRefCamera.current.snapTo(0)
                }}
              />
            </TouchableOpacity>
        </ImageBackground>
      )
    }
  };

  const loadContent = async () => {
    setFirstName(await AsyncStorage.getItem('F_Name'))
    setLastName(await AsyncStorage.getItem('L_Name'))
    setEmail(await AsyncStorage.getItem('Email'))
    if(await AsyncStorage.getItem('C_Code') != null){
      setC_Code(await AsyncStorage.getItem('C_Code'))
    }
    setContact(await AsyncStorage.getItem('Contact'))
    setImage(await AsyncStorage.getItem('Profile_Pic'))
    setLoaded(true)
  };

  const renderHeader = () => {
    return(
        <View style={styles.headerInfoContainer}>
            <TouchableOpacity 
              style={{flex: 0.1}}
              onPress={()=>{
                  navigation.pop()
              }}>
                <SVGBack height={18} width={18}/>
            </TouchableOpacity>
            <View style={{flex: 0.8}}>
              <Text style={styles.headerText}>Edit Account</Text>
            </View>
            <View style={{flex: 0.1}}></View>
        </View>
    )
  };

  const submitRequest = async () => {
    if(firstname === null){
      Toast.show('Add first name to edit', Toast.LONG)
    }
    else if(lastname === ''){
      Toast.show('Add last name to edit', Toast.LONG)
    }
    else if(contact === '' || contact === null){
      Toast.show('Add contact number to edit', Toast.LONG)
    }
    else{
      setLoading(true)
      await updateProfile(email, c_code, contact, firstname, lastname, setLoading)
      await uploadFile(image, 'profile_pic', setLoading, () => navigation.dispatch(resetAction), email, c_code, contact, firstname, lastname)
    }
  };

  const renderContent = () => {
    if(loaded){
      return(
        <View style={{flex: 1}}>
            <View style={styles.container}>
              <View style={{alignItems: 'center', marginBottom: 20}}>
                  {
                    renderProfilePic()
                  }
              </View>
              <View style={styles.textInputContainer}>
                <TextInput 
                    value={firstname}
                    style={styles.textInput} 
                    placeholder='First name'
                    autoCapitalize={'none'} 
                    placeholderTextColor='grey'
                    onChangeText={(text)=>{setFirstName(text)}}/>
                
                <TextInput 
                    value={lastname}
                    style={styles.textInput} 
                    placeholder='Last name'
                    autoCapitalize={'none'} 
                    placeholderTextColor='grey'
                    onChangeText={(text)=>{setLastName(text)}}/>

                <TextInput 
                    value={email}
                    style={styles.textInput} 
                    placeholder='Email'
                    editable={false}
                    autoCapitalize={'none'} 
                    placeholderTextColor='grey'
                    onChangeText={(text)=>{setEmail(text)}}/>
              </View>
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
            </View>
            <TouchableOpacity
                style={styles.updateContainer}
                onPress={()=>{
                  submitRequest()
                }}>
                    <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
        </View>
      )
    }
  };

    return(
        <View style={{flex: 1}}>
          <Spinner visible={loading} />
          <TouchableOpacity 
            style={{flex: 1}}
            activeOpacity={1} 
            onPress={()=>{
              Keyboard.dismiss()
              sheetRefCamera.current.snapTo(2)
            }}>
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 0.075}}>
                {renderHeader()}
              </View>
              <View style={{flex: 0.925}}>
                {renderContent()}
              </View>
            </SafeAreaView>
          </TouchableOpacity>
          <BottomSheet
          ref={sheetRefCamera}
          initialSnap={2}
          snapPoints={[125, 125, 0]}
          borderRadius={10}
          renderContent={renderContentCamera}
        />
        </View>
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
    color: 'black', 
    fontSize: 20, 
    fontWeight: 'bold',
    paddingEnd: 5,
  }, 
  container: {
    flex: 0.9, 
    margin: 20
  },
  updateContainer: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 20,
      height: 45,
      backgroundColor: '#58a279',
      borderRadius: 10,
  },
  updateText:{
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
  },
  textInputContainer: {
  
  },
  textInput: {
      borderWidth: 0.5,
      borderColor: 'silver',
      paddingStart: 15,
      paddingEnd: 15,
      height: 40,
      borderRadius: 5,
      color: 'black',
      marginTop: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  input: {
    paddingStart: 5,
    paddingEnd: 5,
    height: 40,
    color: 'black'
  },
  profileBackground: {
    height: 150, 
    width: 150, 
    borderWidth: 1, 
    borderRadius: 20
  },
  profile_pic: {
    height: 150, 
    width: 150,
  },
  svg: {
    height: 45,
    width: 45,
    position: 'absolute', 
    top: 100, 
    right: 0
  },
  phoneContainer: {
    borderWidth: 0.5,
    borderColor: 'silver',
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 20,
    borderRadius: 5
  },
  textInputPhone: {
    paddingVertical: 0,
    color: 'black',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  }
});

export default EditAccountScreen;