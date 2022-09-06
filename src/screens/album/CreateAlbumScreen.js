import React, {useState, useContext, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView, ImageBackground, SafeAreaView, Keyboard} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetCamera from '../../components/BottomSheetCamera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/AlbumContext';
import uuid from 'react-native-uuid';
import CheckBox from 'react-native-check-box';
import SVGPhoto from '../../asset/icons/album/add_photo.svg';
import SVGBack from '../../asset/icons/back.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

const CreateAlbumScreen = ({navigation}) => {
  const {createAlbum, uploadFile} = useContext(Context);
  const sheetRefCamera = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [checkValue, setCheckValue] = useState(false);
  const [albumSecurity, setAlbumSecurity] = useState('0');
  const [loading, setLoading] = useState(false)
  const descriptionRef = useRef();

  useEffect(async() => {
    setAlbumSecurity(await AsyncStorage.getItem('Album_Security'))
  }, []);

  const renderHeader = () => {
    return(
        <View style={styles.headerInfoContainer}>
            <TouchableOpacity 
              style={{flex: 0.1, alignItems: 'center', padding: 5}}
              onPress={()=>{
                navigation.pop()
              }}>
                <SVGBack height={18} width={18}/>
            </TouchableOpacity>
            <View style={{flex: 0.8}}>
              <Text style={styles.headerText}>Add album</Text>
            </View>
            <View style={{flex: 0.1}}></View>
        </View>
    )
  };

  const renderContentCamera = () => (
    <BottomSheetCamera 
      sheetRefCamera={sheetRefCamera}
      image={image}
      setImage={setImage}
    />
  );

  const renderCheckBox = () => {
    if(albumSecurity === '1'){
      return(
        <TouchableOpacity
          activeOpacity={1}
          style={{flexDirection: 'row', marginBottom: 20, justifyContent: 'center', marginTop: 10}}
          onPress={()=>{
            setCheckValue(!checkValue)
          }}>
          <CheckBox
            style={styles.checkbox}
            checkBoxColor={'#343c71'}
            isChecked={checkValue}
            checkedCheckBoxColor={'green'}
            onClick={async()=>{
              setCheckValue(!checkValue)
            }}
          />
          <Text style={styles.inputTitle}>Album security</Text>
        </TouchableOpacity>
      )
    }
  };

  const submitRequest = async () => {
    if(name === ''){
      Toast.show('Please add album name', Toast.LONG);
    } 
    else{
      setLoading(true)
      const ID = uuid.v4()
      console.log(ID)
      createAlbum(ID, name, description, checkValue ? '1' : '0', null, 0, setLoading, () => navigation.navigate('Home')) 
      //uploading album cover
      image != '' ? uploadFile(image, ID, 'album_cover') : null
    }
  };

    return (
        <TouchableOpacity 
          activeOpacity={1} 
          style={{flex: 1}} 
          onPress={()=>{
            Keyboard.dismiss()
            sheetRefCamera.current.snapTo(2)
          }}>
          <Spinner visible={loading}/>
          <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 0.1}}>
                { renderHeader() }
              </View>
              <View style={{flex: 0.9, marginTop: 20}}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    value={name}
                    style={styles.textInput} 
                    placeholder='Name' 
                    placeholderTextColor='grey'
                    onChangeText={(newText)=>{setName(newText)}}
                  />
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.descriptionContainer} onPress={()=>{descriptionRef.current.focus()}}>
                    <ScrollView>
                      <TextInput
                        ref={descriptionRef}
                        value={description}
                        style={styles.description} 
                        placeholder='Short description about this album...' 
                        multiline
                        placeholderTextColor='grey'
                        onChangeText={(newText)=>{setDescription(newText)}}
                      />
                    </ScrollView>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.imgContainer}
                  onPress={() => {
                    Keyboard.dismiss()
                    sheetRefCamera.current.snapTo(0)
                  }}>
                    {
                      image ? 
                      <Image 
                        style={styles.img}
                        resizeMode='contain' 
                        source={{uri: image}}
                      /> : 
                      <View style={styles.coverContainer}>
                        <SVGPhoto height={120} width={120}/>
                        <Text style={{color: 'grey', marginTop: 10}}>Tap to select album cover</Text>
                      </View>
                    }
                </TouchableOpacity>
                { renderCheckBox() }
              </View>
            </SafeAreaView>
            <View style={{flex: 0.125}}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={()=>{
                  submitRequest()
                }}>
                  <Text style={styles.signupText}>Create album</Text>
              </TouchableOpacity>
            </View> 
          </View>
          <BottomSheet
            ref={sheetRefCamera}
            initialSnap={2}
            snapPoints={[125, 125, 0]}
            borderRadius={10}
            renderContent={renderContentCamera}
          />
        </TouchableOpacity>
      );
};

const styles = StyleSheet.create({
  headerInfoContainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginStart: 5, 
    marginEnd: 5
  },
  headerText: {
    textAlign: 'center', 
    color: 'black', 
    fontSize: 20, 
    fontWeight: 'bold',
    paddingEnd: 5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imgContainer: {
    borderWidth: 0.5,
    borderColor: 'silver',
    flex: 0.8,
    marginTop: 10,
    marginStart: 20,
    marginEnd: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  descriptionContainer: {
    borderWidth: 0.5,
    borderColor: 'silver',
    height: 100, 
    marginStart: 20,
    marginEnd: 20, 
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 5
  },
  description: {
    flex: 1, 
    paddingStart: 15, 
    paddingEnd: 15,
    color: 'black',
  },
  date: {
    padding: 15,
    color: '#58a279',
    fontWeight: 'bold',
  },
  inputTitle: {
    marginStart: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#58a279'
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
  img: {
    flex: 1, 
  },
  coverContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  cover: {
    height: 50,
    width: 50
  },
  checkbox: {
    height: 25,
    width: 25,
  },
});

export default CreateAlbumScreen;