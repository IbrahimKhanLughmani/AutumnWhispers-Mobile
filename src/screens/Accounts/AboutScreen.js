import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, Image} from 'react-native';

const AboutScreen = ({navigation}) => {
    const [description, setDescription] = useState('Autumn Whispers is a unique App which allows you to capture your memories and the voices of people you love.  All kept secure in a private digital vault, on a cloud-based secure storage platform. The App allows you to record family memories & will be accessible for generations to come. Voice notes, messages, songs, stories, traditions, and even secrets saved into the future. Create your own life journey. ')
    return(
        <View style={{flex: 1}}>
           <Text style={{margin: 20, fontWeight: 'bold', color: 'black', fontSize: 20}}>About Us</Text>
           <View style={styles.textInputContainer}>
            <TextInput
                value={description}
                style={styles.textInput} 
                multiline
                placeholder='Description' 
                placeholderTextColor='grey'
                onChangeText={(newText)=>{setDescription(newText)}}
            />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    textInputContainer: {
        marginTop: 10,
        marginStart: 20,
        marginEnd: 20, 
        marginBottom: 20,
    },
    textInput: {
        color: 'black',
        fontSize: 16
    }
});

export default AboutScreen;