import React, { useEffect, useState, useContext, useCallback, Button } from "react";
import {View, Text, PermissionsAndroid, TouchableOpacity, ScrollView, StyleSheet, Platform, Linking, Dimensions} from 'react-native';
import Contacts from 'react-native-contacts';
import { TextInput } from "react-native-gesture-handler";
import { Context } from "../../context/UserContext";
import Axios from 'axios';
import axios from '../../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SVGDelete from '../../asset/icons/delete.svg';
import Toast from 'react-native-simple-toast';
import LoadingView from 'react-native-loading-view';

const InvitationScreen = ({navigation}) => {
    const {updateContacts, deleteJoinedContacts} = useContext(Context);
    const [joined, setJoined] = useState();
    const [appContacts, setAppContacts] = useState();
    const [masterData, setMasterData] = useState();
    const [filterData, setFilterData] = useState();
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [body, setBody] = useState('');
    const [search, setSearch] = useState('');
    const OpenURLButton = ({url, children}) => {
        const handlePress = useCallback(async () => {
            await Linking.openURL(url);
        }, [url]);
            return (
            <TouchableOpacity
                style={styles.inviteBtnContainer}
                onPress={()=>{
                    handlePress()
                }}>
                    <Text style={styles.inviteTextContainer}>{children.text}</Text>
            </TouchableOpacity>
        );
    };

    useEffect(async() => {
        await getContacts()
        await getAppContacts()
        await getJoinedContacts()
    }, []);

    const getContacts = async () => {
        const firstname = await AsyncStorage.getItem('F_Name')
        const lastname = await AsyncStorage.getItem('L_Name')
        if(Platform.OS === 'android'){
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: "Contacts",
                        message: "This app would like to view your contacts."
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    loadContacts();
                } else {
                    alert('You need to give contacts permission')
                    navigation.navigate('Account')
                }
            } 
            catch (err) {
                console.warn(err);
            }
            setBody(`${firstname} ${lastname} has invited you to join Autumn Whispers app.\nFor android: https://play.google.com/store/apps/details?id=com.autumnwhispers\nFor IOS: https://apps.apple.com/pk/app/autumn-whispers/id1599892907`)
        }
        else{
            setBody(`${firstname} ${lastname} has invited you to join Autumn Whispers app.\nFor android: https://play.google.com/store/apps/details?id=com.autumnwhispers\nFor IOS: https://apps.apple.com/pk/app/autumn-whispers/id1599892907`)
            loadContacts() 
        }
    };

    const getAppContacts = async () => {
        try {
            await Axios.get(`${axios.host}${axios.endpoints.getContacts}`, {
              headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
              }
            })
            .then((response) => {
                setAppContacts(response.data)
            })
          } catch (error) {
            setLoading(false)
            console.log(error)
          }
    };

    const loadContacts = async () => {
        try{
            await Contacts.getAll()
            .then(async contacts => {
                //sorting contacts alphabatically
                let sortedArray = contacts.sort(function(a, b) {
                    return a.givenName.localeCompare(b.givenName);
                });
                setMasterData(sortedArray)
                //storing data for searching
                setFilterData(sortedArray)
                setLoading(false)
            })
            .catch(e => {
                console.log("Error", e)
                setLoading(false)
            });
        } catch(err){
            console.log(err)
        }
    };

    const getJoinedContacts = async() => {
        try {
            await Axios.get(`${axios.host}${axios.endpoints.joinedContact}`, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
                }
            })
            .then(async(res) => {
                if(res.data != undefined){
                    setJoined(res.data)
                    await AsyncStorage.setItem('Joined_Users', JSON.stringify(res.data))
                    setLoading2(false)
                }
            })
            .catch((err) => {
                console.log(err.response.data.message)
            })
        } catch (error) {
            console.log(error)  
        } 
    };

    const searchFilter = (text) => {
    if(text){
        const newData = masterData.filter((item) => {
            const itemData = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        });
        setFilterData(newData)
        setSearch(text)
    } else {
        setFilterData(masterData)
        setSearch(text)
    }
    };

    const renderInvite = (contact, number, f_name) => {
        if(Platform.OS === 'android'){
            return(
                <View style={styles.statusContainer}>
                    <TouchableOpacity 
                        style={{justifyContent: 'center', padding: 10}}
                        onPress={async()=>{
                            await deleteJoinedContacts(contact)
                            getAppContacts()
                        }}>
                        <SVGDelete height={18} width={18}/>
                    </TouchableOpacity>
                    <OpenURLButton url={`sms:${number}?body=${body}`}>{{text: '+ Invite', number, f_name}}</OpenURLButton>
                </View>
            )
        }
        else{
            return(
                <View style={styles.statusContainer}>
                    <TouchableOpacity 
                        style={{justifyContent: 'center', padding: 10}}
                        onPress={async()=>{
                            await deleteJoinedContacts(contact)
                            getAppContacts()
                        }}>
                        <SVGDelete height={18} width={18}/>
                    </TouchableOpacity>
                    <OpenURLButton url={`sms:/open?addresses=${number}&body=${body}`}>{{text: '+ Invite', number, f_name}}</OpenURLButton>
                </View>
            )
        }
    };

    const renderAppContacts = (contact, index) => {
        if(contact.joined === 0){
            return(
                <View key={index} style={styles.appcontactsContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={{fontWeight: 'bold'}}>{contact.name}</Text>
                        <Text style={{color: 'grey'}}>{contact.contact_plain}</Text>
                    </View>
                    <View style={{flex: 0.39}}>
                        {renderInvite(contact.contact, contact.contact_plain, contact.name)}
                    </View>
                </View>
            )
        }
        else{
            return(
                <View key={index} style={styles.appcontactsContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={{fontWeight: 'bold'}}>{contact.name}</Text>
                        <Text style={{color: 'grey'}}>{contact.contact_plain}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <TouchableOpacity 
                            style={{justifyContent: 'center', padding: 10}}
                            onPress={async()=>{
                                await deleteJoinedContacts(contact.contact)
                                getAppContacts()
                            }}>
                            <SVGDelete height={18} width={18}/>
                        </TouchableOpacity>
                        <View style={styles.inviteBtnContainer}>
                            <Text style={styles.inviteTextContainer}> Joined</Text>
                        </View>
                    </View>
                </View>
            )
        }
    };

    return(
        <ScrollView>
            <View style={{flex: 0.9}}>
                <View style={{padding: 20}}>
                    <Text style={{textAlign: 'center'}}>Invite friends from your phonebook contacts to join Autumn Whispers</Text>
                </View>
                <View style={{paddingStart: 20, paddingTop: 20}}>
                    <Text style={{fontWeight: 'bold'}}>Invite to Autumn Whispers</Text>
                </View>
                <View style={styles.container}>
                    <TextInput
                        value={search}
                        style={{paddingStart: 20, color: 'black', padding: 10}} 
                        placeholder='Search' 
                        placeholderTextColor='grey'
                        autoCorrect={false}
                        onChangeText={(newText)=>{searchFilter(newText)}}    
                    />
                    <LoadingView style={{flex: 1}} loading={loading}>
                        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
                        {
                            loading ? null : 
                            filterData.map((contact, index) => {
                                return (
                                    //check if number is not null
                                    contact.phoneNumbers[0] ?
                                    <View key={index} style={styles.contactsContainer}>
                                        <View style={styles.nameContainer}>
                                            <Text style={{fontWeight: 'bold'}}>{`${contact.givenName} ${contact.familyName}`}</Text>
                                            <Text style={{color: 'grey'}}>{`${contact.phoneNumbers[0].number}`}</Text>
                                        </View>
                                        <View style={styles.inviteContainer}>
                                            <TouchableOpacity
                                                style={styles.inviteBtnContainer}
                                                onPress={async()=>{
                                                    const Contacts = []
                                                    Contacts.push({
                                                        contact: contact.phoneNumbers[0].number.replace(/ /g,'').replace(/-/g,'').replace('+',''), 
                                                        contact_plain: contact.phoneNumbers[0].number, 
                                                        c_code: '', 
                                                        name: `${contact.givenName} ${contact.familyName}`
                                                    })
                                                    const obj = { "contacts": Contacts }
                                                    await updateContacts(obj)
                                                    getAppContacts()
                                                }}>
                                                    <Text style={styles.inviteTextContainer}>Add +</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View> : null
                                );
                            })
                        }
                        </ScrollView>
                    </LoadingView>
                </View>
                <View style={{paddingStart: 20, paddingTop: 20}}>
                    <Text style={{fontWeight: 'bold'}}>App contacts</Text>
                </View>
                <View style={styles.container}>
                    <LoadingView style={{flex: 1}} loading={loading2}>
                        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
                        {
                            loading2 ? null :
                            appContacts.map((contact, index) => {
                                return (
                                    renderAppContacts(contact, index)
                                );
                            })
                        }
                        </ScrollView>
                    </LoadingView>
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        height: 300, 
        backgroundColor: 'white', 
        margin: 20, 
        borderRadius: 10
    },
    contactsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingTop: 10, 
        paddingBottom: 10, 
        borderBottomWidth: 1, 
        borderColor: '#efefef'
    },
    appcontactsContainer: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingTop: 10, 
        paddingBottom: 10, 
        borderBottomWidth: 1, 
        borderColor: '#efefef'
    },
    nameContainer: {
        flex: 0.5,
         paddingStart: 20
    },
    inviteContainer: {
        flex: 0.5, 
        alignItems: 'flex-end', 
        justifyContent: 'center', 
        paddingEnd: 20
    },
    inviteBtnContainer: {
        backgroundColor: '#58a279', 
        justifyContent: 'center',
        paddingBottom: 5,
        paddingTop: 5,
        paddingStart: 10,
        paddingEnd: 10,
        borderRadius: 20
    },
    statusContainer: {
        flex: 0.35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginEnd: 20,
    },
    inviteTextContainer:{
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
})

export default InvitationScreen;