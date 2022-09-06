import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import Video from 'react-native-video';
import { StackActions, NavigationActions } from 'react-navigation';

const VideoScreen = ({navigation}) => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Home'})],
        key: null,
      });
    const windowHeight = Dimensions.get('window').height;
    onBuffer = () => {
        //code during buffering
    }
    videoError = () => {
        alert('Error loading the video');
    }
    return(
        <View style={{flex: 1}}>
            <View style={styles.videoContainer}>
                <Video source={require('../assets/video/video.mp4')}                                    
                    onBuffer={onBuffer}           
                    onError={videoError} 
                    repeat
                    resizeMode={'cover'}              
                    style={{height: windowHeight, width: null}} 
                />
            </View>
            <TouchableOpacity
                style={styles.getStartedContainer}
                onPress={()=>{
                    navigation.dispatch(resetAction)
                }}>
                    <Text style={styles.getStartedText}>Skip</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    videoContainer: {
        flex: 0.9, 
        backgroundColor: 'black',
    },
    getStartedContainer: {
        flex: 0.1, 
        backgroundColor: '#58a279', 
        justifyContent: 'center',
    },
    getStartedText:{
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
});

export default VideoScreen;