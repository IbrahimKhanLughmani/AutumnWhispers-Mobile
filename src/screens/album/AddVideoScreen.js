import React, {useState, useRef, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView, Platform} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetVideo from '../../components/BottomSheetVideo';
import CameraRoll from "@react-native-community/cameraroll";
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import { Context } from '../../context/AlbumContext';
import SVG from '../../assets/album/star.svg';
import uuid from 'react-native-uuid';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

const AddVideoScreen = ({navigation}) => {
    const {saveVideo} = useContext(Context);
    const album = navigation.getParam('album')
    const [video, setVideo] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const sheetRefVideo = useRef(null);
    const [opaque, setOpaque] = useState(1);
    const [loading, setLoading] = useState(false)

    const renderContentVideo = () => (
        <BottomSheetVideo 
            sheetRefVideo={sheetRefVideo}
            setOpaque={setOpaque}
            setVideo={setVideo}
        />
    );

    const saveToGallery = async () => {
      if(video === ''){
        Toast.show('Please add video', Toast.LONG);
      } 
      else{
        console.log(video)
        setLoading(true)
        const ID = uuid.v4()
        await saveVideo(album.fe_album_id, ID, videoDescription, Platform.OS === 'android' ? video : video.slice(8), setLoading, ()=>{navigation.navigate('Album')})
        // await CameraRoll.save(video)
      }
    };

    return(
      <>
        <Spinner visible={loading}/>
        <View style={{flex: 1}} opacity={opaque}>
          <ScrollView style={{flex: 0.9}}>
            <View style={styles.textInputContainer}>
              <TextInput
                value={videoDescription}
                style={styles.textInput} 
                multiline
                placeholder='Write something about this video...' 
                placeholderTextColor='grey'
                onChangeText={(newText)=>{setVideoDescription(newText)}}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.videoText}>Select video</Text>
            </View>
            <TouchableOpacity 
              style={styles.videoContainer}
              onPress={() => {
                // chooseImage()
                sheetRefVideo.current.snapTo(0)
              }}>
                {
                  video ? 
                  <VideoPlayer 
                    source={{uri: video}}                 
                    onBack={()=>{
                        setVideo(null)
                    }}              
                  /> : 
                  <View style={styles.coverContainer}>
                    <Image style={styles.cover} source={require('../../assets/album/add-video.png')}/>
                  </View>
                }
                
            </TouchableOpacity>    
          </ScrollView>
          <TouchableOpacity
              style={styles.createContainer}
              onPress={()=>{
                saveToGallery();
          }}>
                  <Text style={styles.createText}>Add video to album</Text>
              </TouchableOpacity>
        </View>
        <BottomSheet
          ref={sheetRefVideo}
          initialSnap={2}
          snapPoints={[125, 125, 0]}
          borderRadius={10}
          renderContent={renderContentVideo}
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
  videoContainer: {
    height: 300,
    justifyContent: 'center',
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  videoText: {
    fontWeight: 'bold', 
    marginStart: 20, 
    marginBottom: 10
  },
  star: {
    height: 8, 
    width: 8, 
    marginStart: 5
  },
  required: {
    color: 'red',
    marginStart: 20
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

export default AddVideoScreen;