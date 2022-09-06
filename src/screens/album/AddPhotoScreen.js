import React, {useState, useRef, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView, Button, PermissionsAndroid} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetCamera from '../../components/BottomSheetCamera';
import CameraRoll from "@react-native-community/cameraroll";
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import { Context } from '../../context/AlbumContext';
import uuid from 'react-native-uuid';
import SVG from '../../assets/album/star.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

const AddPhotoScreen = ({navigation}) => {
    const {savePhoto} = useContext(Context);
    const album = navigation.getParam('album')
    const [image, setImage] = useState('');
    const [imgDescription, setImgDescription] = useState('');
    const sheetRefCamera = useRef(null);
    const [opaque, setOpaque] = useState(1);
    const [loading, setLoading] = useState(false)

    const renderContentCamera = () => (
      <BottomSheetCamera 
        sheetRefCamera={sheetRefCamera}
        setOpaque={setOpaque}
        setImage={setImage}
      />
    );

    const saveToGallery = async () => {
      if(image === ''){
        Toast.show('Please add photo', Toast.LONG);
      } 
      else{
        const ID = uuid.v4()
        setLoading(true)
        await savePhoto(ID, imgDescription, album.fe_album_id, image, setLoading, ()=>{navigation.navigate('Album')})
        // await CameraRoll.save(image)
      }
    };

    return(
      <>
        <Spinner visible={loading}/>
        <View style={{flex: 1}} opacity={opaque}>
          <ScrollView style={{flex: 0.9}}>
            <View style={styles.textInputContainer}>
              <TextInput
                value={imgDescription}
                style={styles.textInput} 
                multiline
                placeholder='Write something about this photo...' 
                placeholderTextColor='grey'
                onChangeText={(newText)=>{setImgDescription(newText)}}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.imgText}>Select photo</Text>
            </View>
            <TouchableOpacity 
              style={styles.imgContainer}
              onPress={() => {
                // chooseImage()
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
                    <Image style={styles.cover} source={require('../../assets/album/add-photo.png')}/>
                  </View>
                }
                
            </TouchableOpacity>    
          </ScrollView>
          <TouchableOpacity
              style={styles.createContainer}
              onPress={()=>{
                saveToGallery()
              }}>
                  <Text style={styles.createText}>Add photo to album</Text>
              </TouchableOpacity>
        </View>
        <BottomSheet
          ref={sheetRefCamera}
          initialSnap={2}
          snapPoints={[125, 125, 0]}
          borderRadius={10}
          renderContent={renderContentCamera}
        />
      </>
    )
};

const styles = StyleSheet.create({
  textInputContainer: {
      borderRadius: 10, 
      borderWidth: 1, 
      borderColor: 'silver',
      marginTop: 20,
      marginStart: 20,
      marginEnd: 20, 
      marginBottom: 20,
      backgroundColor: '#efefef',
  },
  textInput: {
    paddingTop: 7.5,
    paddingBottom: 7.5,
    marginStart: 7.5,
    marginEnd: 7.5,
    color: 'black'
  },
  date: {
    padding: 15,
    color: '#58a279',
    fontWeight: 'bold',
  },
  arrow: {
    height: 10, 
    width: 10, 
    marginEnd: 15
  },
  inputTitle: {
    marginStart: 20,
    fontWeight: 'bold',
  },
  imgText: {
    fontWeight: 'bold', 
    marginStart: 20, 
    marginBottom: 10
  },
  imgContainer: {
    height: 300,
    justifyContent: 'center',
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  img: {
    height: 300, 
    width: null, 
    borderRadius: 5, 
  },
  star: {
    height: 8, 
    width: 8, 
    marginStart: 5
  },
  coverContainer: {
    height: 300, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: 'silver', 
    borderWidth: 1, 
    borderRadius: 10
  },
  cover: {
    height: 50,
    width: 50
  },
  createContainer: {
    flex: 0.1, 
    backgroundColor: '#58a279', 
    justifyContent: 'center',
  },
  createText:{
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
  },
  required: {
    color: 'red',
    marginStart: 20
  }
});

export default AddPhotoScreen;