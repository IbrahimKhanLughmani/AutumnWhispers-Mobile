import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export default BottomSheetVideo = ({sheetRefVideo, setOpaque, setVideo}) => {

  const chooseVideo = () => {
      ImagePicker.openPicker({
        mediaType: "video",
      })
      .then((video) => {
        console.log(video);
        setVideo(video.path)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const captureVideo = () => {
      ImagePicker.openCamera({
        mediaType: "video",
      })
      .then(video => {
        console.log(video);
        setVideo(video.path)
      })
      .catch((err) => {
        console.log(err)
      })
  };

    return(
        <View style={styles.bottomContainer}>
            <View style={{flex: 1}}>
                <TouchableOpacity 
                    style={{borderColor: 'grey', borderBottomWidth: 0.5, alignItems: 'center', padding: 10}}
                    onPress={()=>{
                        chooseVideo()
                        sheetRefVideo.current.snapTo(2);
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#58a279'}}>Choose from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{borderColor: 'grey', borderBottomWidth: 0.5, alignItems: 'center', padding: 10}}
                    onPress={()=>{
                        captureVideo()
                        sheetRefVideo.current.snapTo(2);
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#58a279'}}>Open camera</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{borderColor: 'grey', borderBottomWidth: 0.5, alignItems: 'center', padding: 10}}
                    onPress={()=>{
                        sheetRefVideo.current.snapTo(2);
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#58a279'}}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    bottomContainer: {
        backgroundColor: '#dcdcdc', 
        height: 125,
      },
      subContainer1: {
        flex: 0.85, 
        paddingStart: 20, 
        paddingEnd: 20, 
        paddingTop: 10
      },
      bottomHeadingContainer: {
        flex: 0.2, 
        alignItems: 'flex-start'
      },
      cross: {
        height: 15, 
        width: 15
      },
      bottomTitle: {
        flex: 0.6, 
        alignItems: 'center'
      }
})