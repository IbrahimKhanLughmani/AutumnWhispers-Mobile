import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default AlbumHeader = ({navigation, sounds, setSounds, photos, setPhotos, videos, setVideos, info, setInfo}) => {

    const renderContent = () => {
        if(sounds){
            return(
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={styles.highlightedContainer}
                        onPress={()=>{
                            //do nothing
                        }}>
                        <Text style={styles.highlightedText}>Sounds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setPhotos(true);
                            navigation.setParams({
                                photo: true,
                            });
                            setSounds(false);
                            navigation.setParams({
                                sound: false,
                            });
                        }}>
                        <Text style={styles.text}>Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setVideos(true);
                            navigation.setParams({
                                video: true,
                            });
                            setSounds(false);
                            navigation.setParams({
                                sound: false,
                            });
                        }}>
                        <Text style={styles.text}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setInfo(true);
                            navigation.setParams({
                                info: true,
                            });
                            setSounds(false);
                            navigation.setParams({
                                sound: false,
                            });
                        }}>
                        <Text style={styles.text}>Info</Text>
                    </TouchableOpacity>
                </View>       
            )
        } else if(photos){
            return(
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setSounds(true);
                            navigation.setParams({
                                sound: true,
                            });
                            setPhotos(false);
                            navigation.setParams({
                                photo: false,
                            });
                        }}>
                        <Text style={styles.text}>Sounds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.highlightedContainer}
                        onPress={()=>{
                            //do nothing
                        }}>
                        <Text style={styles.highlightedText}>Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setVideos(true);
                            navigation.setParams({
                                video: true,
                            });
                            setPhotos(false);
                            navigation.setParams({
                                photo: false,
                            });
                        }}>
                        <Text style={styles.text}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setInfo(true);
                            navigation.setParams({
                                info: true,
                            });
                            setPhotos(false);
                            navigation.setParams({
                                photos: false,
                            });
                        }}>
                        <Text style={styles.text}>Info</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(videos){
            return(
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setSounds(true);
                            navigation.setParams({
                                sound: true,
                            });
                            setVideos(false);
                            navigation.setParams({
                                video: false,
                            });
                        }}>
                        <Text style={styles.text}>Sounds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setPhotos(true);
                            navigation.setParams({
                                photo: true,
                            });
                            setVideos(false);
                            navigation.setParams({
                                video: false,
                            });
                        }}>
                        <Text style={styles.text}>Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.highlightedContainer}
                        onPress={()=>{
                            //do nothing
                        }}>
                        <Text style={styles.highlightedText}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setInfo(true);
                            navigation.setParams({
                                info: true,
                            });
                            setVideos(false);
                            navigation.setParams({
                                video: false,
                            });
                        }}>
                        <Text style={styles.text}>Info</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(info){
            return(
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setSounds(true);
                            navigation.setParams({
                                sound: true,
                            });
                            setInfo(false);
                            navigation.setParams({
                                info: false,
                            });
                        }}>
                        <Text style={styles.text}>Sounds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setPhotos(true);
                            navigation.setParams({
                                photo: true,
                            });
                            setInfo(false);
                            navigation.setParams({
                                info: false,
                            });
                        }}>
                        <Text style={styles.text}>Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.container}
                        onPress={()=>{
                            setVideos(true);
                            navigation.setParams({
                                video: true,
                            });
                            setInfo(false);
                            navigation.setParams({
                                info: false,
                            });
                        }}>
                        <Text style={styles.text}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.highlightedContainer}
                        onPress={()=>{
                            //do nothing
                        }}>
                        <Text style={styles.highlightedText}>Info</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    };
    
    return(
        <View style={{flex: 1}}>
            { renderContent() }    
        </View>
    )
};

const styles = StyleSheet.create({
    highlightedContainer: {
        flex: 0.25, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottomWidth: 5, 
        borderColor: '#58a279'
    },
    container: {
        flex: 0.25, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottomWidth: 0.5, 
        borderColor: 'grey'
    },
    highlightedText: {
        fontWeight: 'bold', 
        color: '#58a279'
    },
    text: {
        fontWeight: 'bold',
        color: 'black'
    }
})