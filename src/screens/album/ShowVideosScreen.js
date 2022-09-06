import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VideoPlayer from 'react-native-video-controls';

const ShowVideosScreen = ({navigation}) => {
    const Video = navigation.getParam('video');
    
    return(
        <View style={{flex: 0.9, margin: 20}}>
            <VideoPlayer
                source={{ uri: `file://${Video.cover_path}` }}
                style={{borderRadius: 5}}
                paused={true}
                // showOnStart
                disableVolume
                // disableFullscreen
                disableBack
            />
            <Text style={{fontWeight: 'bold', color: 'grey', marginTop: 20, marginBottom: 20}}>Description: {Video.description}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    
})

export default ShowVideosScreen;