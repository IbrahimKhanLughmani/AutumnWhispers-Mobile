import React, {useState, useRef, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView, Platform} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetCamera from '../../components/BottomSheetCamera';
import AudioRecorder from '../../components/AudioRecorder';
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import { Context } from '../../context/AlbumContext';
import uuid from 'react-native-uuid';
import Spinner from 'react-native-loading-spinner-overlay';

const AddSoundScreen = ({navigation}) => {
    const {saveSound} = useContext(Context);
    const album = navigation.getParam('album');
    const path = navigation.getParam('Path');
    const duration = navigation.getParam('Duration');
    const [image, setImage] = useState();
    const [thought, setThought] = useState('');
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

    const save_Sound = async () => {
      setLoading(true)
      await saveSound(album.fe_album_id, uuid.v4(), thought, image === undefined ? ' ' : image, Platform.OS === 'android' ? path : path.slice(8), duration, setLoading, ()=>{navigation.navigate('Album')})      
    };

    return(
      <>
       <Spinner visible={loading}/>
        <View style={{flex: 1}} opacity={opaque}>
          <ScrollView style={{flex: 0.9}}>
            <View style={styles.textInputContainer}>
              <TextInput
                value={thought}
                style={styles.textInput} 
                multiline
                placeholder="Groom's thought about the day" 
                placeholderTextColor='grey'
                onChangeText={(newText)=>{setThought(newText)}}
              />
            </View>
            <AudioRecorder 
              Path={navigation.getParam('Path')}/>
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
              save_Sound()
            }}>
            <Text style={styles.createText}>Add sound to album</Text>
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
  inputTitle: {
    marginStart: 20,
    fontWeight: 'bold',
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
});

export default AddSoundScreen;