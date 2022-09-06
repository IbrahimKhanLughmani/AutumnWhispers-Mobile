import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Keyboard, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Context } from '../../context/UserContext';
import Toast from 'react-native-simple-toast';

const ContactusScreen = ({navigation}) => {
    const { contactUs } = useContext(Context)
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('')

    const handleEmail = () => {
        if(subject === ''){
            Toast.show('Please write subject of your feedback', Toast.LONG)        
        }
        else if(message === ''){
            Toast.show('Please write a message for your feedback', Toast.LONG)        
        }
        else{
            contactUs(subject, message, navigation.navigate('Account'))
        }
    };

    return(
        <TouchableOpacity 
            style={{flex: 1}} 
            activeOpacity={1}
            onPress={()=>{
                Keyboard.dismiss()
            }}>
            <View style={styles.container}>
                <Text style={{margin: 20, color: 'grey', textAlign: 'center'}}>Please send us your queries, suggestions or comments below</Text>
                <Text style={{fontWeight: 'bold', color: 'black'}}>Subject</Text>
                <TextInput 
                    value={subject}
                    style={styles.subjectTextInput}
                    placeholder='Subject' 
                    placeholderTextColor='grey'
                    onChangeText={(text)=>{setSubject(text)}}
                />
                <Text style={{fontWeight: 'bold', color: 'black'}}>Message</Text>
                <ScrollView style={styles.textInputContainer}>
                    <TextInput 
                        value={message}
                        style={styles.textInput}
                        placeholder='Please type your message here...' 
                        placeholderTextColor='grey'
                        multiline
                        onChangeText={(text)=>{setMessage(text)}}
                    />
                </ScrollView>
            </View>
            <View style={{flex: 0.2}}>

            </View>
            <TouchableOpacity
                style={styles.getStartedContainer}
                onPress={async()=>{
                    handleEmail()
                }}>
                <Text style={styles.getStartedText}>Send</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 0.7, 
        marginStart: 20, 
        marginEnd: 20
    },
    textInputContainer: {
        borderWidth: 1, 
        borderColor: 'silver', 
        borderRadius: 10,  
        marginTop: 10
    },
    subjectTextInput: {
        height: 40,
        paddingStart: 15,
        paddingEnd: 15,
        color: 'black',
        borderWidth: 1, 
        borderColor: 'silver', 
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20
    },
    textInput: {
        marginTop: 5,
        marginStart: 10,
        marginEnd: 10,
        marginBottom: 5,
        color: 'black'
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

export default ContactusScreen;