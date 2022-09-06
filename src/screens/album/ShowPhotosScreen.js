import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;

const ShowPhotosScreen = ({navigation}) => {
    const Photo = navigation.getParam('photo')
    
    return(
        <View style={{margin: 20}}>
            <Image style={{height: screenHeight*0.6, borderRadius: 5}}  source={{uri: Photo.cover_path}}/>
            <Text style={{fontWeight: 'bold', color: 'grey', marginTop: 20}}>Description: {Photo.description}</Text>
        </View>
    )
};

export default ShowPhotosScreen;