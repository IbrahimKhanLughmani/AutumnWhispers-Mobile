import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Image, FlatList, Platform, ScrollView, SafeAreaView, Alert} from 'react-native';
import Modal from "react-native-modal";
import Calender from '../../components/Calender';
import Axios from 'axios';
import axios from '../../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../context/AlbumContext';
import LoadingView from 'react-native-loading-view'
import SVGEdit from '../../asset/icons/edit.svg';
import SVGBack from '../../asset/icons/back.svg';
import SVGDelete from '../../asset/icons/delete.svg';
import Toast from 'react-native-simple-toast';

export default InfoNavigator = ({album, shared, SheetRef, navigation}) => {
    const {shareAlbum, deleteSharedAlbum} = useContext(Context);
    const [isJoinedVisible, setJoinedVisible] = useState(false);
    const [changeModel, setChangeModel] = useState(false);
    const [search, setSearch] = useState('');
    const [item, setItem] = useState('');
    const [markDate, setMarkDate] = useState('');
    const [share, setShare] = useState([]);
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [showBox, setShowBox] = useState(true);

    useEffect(async() => {
        await getSharedWith()
        await getJoinedContacts()
        setLoading(false)
    }, []);

    const getSharedWith = async () => {
        try {
            await Axios.get(`${axios.host}${axios.endpoints.getAlbumById}${album.fe_album_id}`, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
                }
            })
            .then(async(res) => {
                setShare(res.data[0].shared_with)

            })
            .catch((err) => {
                console.log(err.response.data.message)
            })
        } 
        catch (error) {
            console.log(error)
        }    
    };

    const getJoinedContacts = async() => {
        try {
            await Axios.get(`${axios.host}${axios.endpoints.joinedContact}`, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
                }
            })
            .then((res) => {
                if(res.data != undefined){
                    setJoinedUsers(res.data)
                    setFilteredUsers(res.data)
                }
            })
            .catch((err) => {
                console.log(err.response.data.message)
            })
        } catch (error) {
            console.log(error)  
        } 
    };

    const toggleJoinedModal = () => {
        setJoinedVisible(!isJoinedVisible);
    };

    const searchFilter = (text) => {
        if(text){
            const newData = joinedUsers.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            });
            setFilteredUsers(newData)
            setSearch(text)
        } else {
            setFilteredUsers(joinedUsers)
            setSearch(text)
        }
    };

    const showConfirmDialog = (fe_album_id, shared_with) => {
        return Alert.alert(
            "Delete shared album?",
            "Are you sure you want to delete the shared album?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        await deleteSharedAlbum(fe_album_id, shared_with)
                        getSharedWith()
                        setShowBox(false)
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    const renderSharedName = (item) => {
        const Name = joinedUsers.map((user) => {
            if(user.id === item.shared_with){
                return user.name
            }
        })
        return <Text style={styles.sharedWithName}>{Name}</Text> 
    };

    const renderCheckBox = () => {
        return(
            <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', marginTop: 10}} onPress={()=>{Toast.show('Please go to edit album', Toast.SHORT)}}>
                <Text style={{fontWeight: 'bold', color: 'black', marginEnd: 10}}>Album security:</Text>
                { album.liveliness_detection === 0 ? 
                  <Text style={{fontWeight: 'bold', color: 'red'}}>Not active</Text> :
                  <Text style={{fontWeight: 'bold', color: '#58a279'}}>Active</Text> }
            </TouchableOpacity>
        )
    };

    const renderSharedStatus = (item) => {
        if(item.status === 'pending'){
            return(
                <View style={styles.sharedWithStatusPending}>
                    <Text style={styles.sharedWithStatus}>{item.status}</Text>
                </View>
            )
        }
        else if(item.status === 'accepted'){
            return(
                <View style={styles.sharedWithStatusAccept}>
                    <Text style={styles.sharedWithStatus}>{item.status}</Text>
                </View>
            )
        }
        else if(item.status === 'denied'){
            return(
                <View style={styles.sharedWithStatusReject}>
                    <Text style={styles.sharedWithStatus}>{item.status}</Text>
                </View>
            )
        }
    };

    const renderSharedWith = () => {
        if(shared){
            return(
                <View style={styles.sharedWithContainer}>
                    <Text style={styles.sharedWithText}>Shared With</Text>
                    <View style={styles.sharedWith}>
                        <LoadingView loading={loading}>
                            <FlatList 
                                data={share}
                                renderItem={({item})=>{
                                    return(
                                        <View style={styles.sharedWithFlatlist}>
                                            <View style={styles.sharedWithIconContainer}>
                                                <Image style={styles.sharedWithIcon} source={require('../../asset/icons/profile/profile.png')}/>
                                            </View>
                                            <View style={styles.sharedWithDetailsContainer}>
                                                {renderSharedName(item)}
                                                <Text style={styles.sharedWithDate}>{item.share_date}</Text>
                                                {renderSharedStatus(item)}
                                            </View>
                                            <View style={styles.sharedWithButtonsContainer}>
                                                <TouchableOpacity 
                                                    style={styles.sharedWithButton}
                                                    onPress={()=>{
                                                        if(item.status === 'pending'){
                                                            setItem({id: item.shared_with})
                                                            setChangeModel(true)
                                                            toggleJoinedModal()
                                                        }
                                                        else{
                                                            Toast.show('Album already shared', Toast.SHORT);
                                                        }
                                                    }}>
                                                    <SVGEdit height={18} width={18}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={styles.sharedWithButton}
                                                    onPress={()=>{
                                                        showConfirmDialog(album.fe_album_id, item.shared_with)
                                                    }}>
                                                    <SVGDelete height={18} width={18}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </LoadingView>
                    </View>
                    { renderModal() }
                    <TouchableOpacity
                        style={styles.shareButton}
                        underlayColor='#fff'
                        onPress={async()=>{
                            toggleJoinedModal()
                        }}>
                            <Text style={styles.shareButtonText}>Share Album With</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    };

    const renderModal = () => {
        return(
            <Modal 
                isVisible={isJoinedVisible} 
                onBackdropPress={()=>{
                    setChangeModel(false)
                    setJoinedVisible(false)
                }} 
                onRequestClose={()=>{
                    setChangeModel(false)
                    setJoinedVisible(false)
                }}>
            {
                !changeModel ?
                (
                    <SafeAreaView style={{flex: 1}}>
                        <View style={styles.toggleContainer2}>
                            <View style={{alignSelf: 'center', margin: 10}}>
                                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Please select a contact to share the album with</Text>
                            </View>
                            <View style={styles.firstToggleHeader}>
                                <TouchableOpacity 
                                    style={styles.searchBackBtn}
                                    onPress={()=>{
                                        toggleJoinedModal()
                                    }}>
                                    <SVGBack height={18} width={18}/>
                                </TouchableOpacity>
                                <TextInput
                                    value={search}
                                    style={styles.textInput} 
                                    placeholder='Search Contacts' 
                                    placeholderTextColor='grey'
                                    onChangeText={(newText)=>{searchFilter(newText)}}
                                />
                            </View>
                            <FlatList 
                                style={styles.firstToggleFlatlist}
                                data={filteredUsers}
                                key={filteredUsers.id}
                                renderItem={({item})=>{
                                    return(
                                        <TouchableOpacity 
                                            style={styles.searchBody}
                                            onPress={()=>{
                                                setItem(item)
                                                setChangeModel(true)
                                            }}>
                                            <View style={{flex: 0.2, alignItems: 'center'}}>
                                                <Image style={styles.sharedWithIcon} source={require('../../asset/icons/profile/profile.png')}/>
                                            </View>
                                            <View style={{flex: 0.8}}>
                                                <Text style={styles.sharedWithName}>{item.name}</Text>
                                                <Text style={styles.sharedWithDate}>{item.contact}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            /> 
                        </View>
                    </SafeAreaView>
                ) :
                (
                    <View style={styles.toggleContainer}>
                        <View style={styles.calender}>
                            <Calender markDate={markDate} setMarkDate={setMarkDate}/>
                        </View>
                        <TouchableOpacity 
                            style={styles.setContainer}
                            onPress={async()=>{
                                if(markDate === ''){
                                    Toast.show('Please mark a date', Toast.SHORT);
                                }
                                else{
                                    setLoading(true)
                                    toggleJoinedModal()
                                    setChangeModel(false)
                                    await shareAlbum(album.fe_album_id, item.id, markDate, setLoading, ()=>{getSharedWith()})
                                }
                            }}>
                            <Text style={styles.setText}>Set</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            </Modal>
        )
    };

      return (
        <View style={{flex: 1, paddingTop: 10}}>
            <View style={styles.coverContainer}>
                <Image 
                    style={styles.coverImage} 
                    source={album.cover_path === null ? require('../../assets/album/album.png') : {uri: album.cover_path}}/>
            </View>
            <View style={{flex: 0.4}}>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        value={album.name}
                        style={styles.textInputName} 
                        placeholder='Email'
                        autoCapitalize={'none'} 
                        placeholderTextColor='grey'
                        editable={false}
                        onChangeText={(text)=>{setName(text)}}/>
                    <ScrollView style={styles.scrollViewContainer}>
                        <TextInput 
                            value={album.description}
                            style={styles.textInputDescription} 
                            placeholder='No Description'
                            autoCapitalize={'none'} 
                            editable={false}
                            multiline
                            placeholderTextColor='grey'
                            onChangeText={(text)=>{setDescription(text)}}/>
                    </ScrollView>
                    {renderCheckBox()}
                </View>
            </View>
            { renderSharedWith() }
        </View>
      );
};

const styles = StyleSheet.create({
    headerInfoContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginStart: 20, 
        marginEnd: 20
    },
    coverContainer: {
        flex: 0.2, 
        justifyContent: 'center', 
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    coverImage: {
        height: 85, 
        width: 85, 
        borderRadius: 10
    },
    textInputContainer: {
        marginStart: 20,
        marginEnd: 20,
    },
    textInputName: {
        borderWidth: 0.5,
        borderColor: 'silver',
        paddingStart: 15,
        paddingEnd: 15,
        height: 40,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: 'black'
    },
    scrollViewContainer: {
        borderWidth: 0.5,
        borderColor: 'silver',
        height: 70,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    textInputDescription: {
        marginStart: 10,
        marginEnd: 10,
        color: 'black',
    },
    shareButton: {
        justifyContent: 'center',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        height: 45,
        backgroundColor: '#58a279',
        borderRadius: 10,
    },
    shareButtonText: {
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
    toggleContainer: {
        flex: 0.65,
        backgroundColor: 'white', 
        borderRadius: 10
    },
    toggleContainer2: {
        flex: 1,
        backgroundColor: 'white', 
        borderRadius: 10
    },
    firstToggleHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 20,
        marginTop: 10
    },
    firstToggleFlatlist: {
        borderWidth: 0.5,
        borderColor: 'silver',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginStart: 20, 
        marginBottom: 20, 
        marginEnd: 20, 
        borderRadius: 5, 
        paddingStart: 10, 
        paddingEnd: 10
    },
    searchBody: {
        flexDirection: 'row',
        paddingBottom: 10, 
        paddingTop: 10, 
        borderBottomWidth: 2, 
        borderColor: 'silver'
    },
    close: {
        height: 15, 
        width: 15
    },
    calender: {
        flex: 0.85, 
        justifyContent: 'center'
    },
    setContainer: {
        flex: 0.15,
        justifyContent: 'center',
        marginStart: 20,
        margin: 20,
        backgroundColor: '#58a279',
        borderRadius: 10,
    },
    setText: {
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
    subContainer1: {
        flex: 0.85, 
        paddingStart: 20, 
        paddingEnd: 20, 
        paddingTop: 10
    },
    subContainer2: {
        flex: 0.1, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    bottomHeadingContainer: {
        flex: 0.2, 
        alignItems: 'flex-end'
    },
    bottomTitle: {
        flex: 0.6, 
        alignItems: 'center'
    },
    searchBackBtn: {
        flex: 0.075, 
        justifyContent: 'center', 
        alignSelf: 'center', 
        padding: 10
    },
    textInput: {
        borderColor: 'silver',
        borderWidth: 0.5,
        flex: 0.925,
        padding: 5,
        color: '#58a279',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 5,
        paddingStart: 10,
    },
    sharedWithContainer: {
        flex: 0.5, 
        marginStart: 20, 
        marginEnd: 20, 
        marginBottom: 20
    },
    sharedWithText: {
        color: 'black', 
        fontWeight: 'bold'
    },
    sharedWith: {
        borderWidth: 0.5,
        borderColor: 'silver',
        height: 210, 
        marginTop: 10, 
        borderRadius: 10, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    sharedWithFlatlist: {
        flex: 1, 
        marginStart: 20, 
        marginEnd: 20, 
        marginTop: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 2, 
        borderBottomColor: 'silver'
    },
    sharedWithIconContainer: {
        flex: 0.15, 
        alignItems: 'center'
    },
    sharedWithIcon: {
        height: 40, 
        width: 40, 
        borderRadius: 100
    },
    sharedWithDetailsContainer: {
        flex: 0.55, 
        paddingStart: 5
    },
    sharedWithName: {
        color: 'black', 
        fontWeight: 'bold', 
        fontSize: 15
    },
    sharedWithDate: {
        marginEnd: 10, 
        color: 'grey', 
        fontSize: 12
    },
    sharedWithStatusAccept: {
        backgroundColor: 'rgba(0, 100, 0, 0.6)', 
        alignSelf: 'flex-start', 
        paddingStart: 10, 
        paddingEnd: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 20, 
        marginTop: 5, 
        marginBottom: 10
    },
    sharedWithStatusPending: {
        backgroundColor: 'rgba(0, 0, 255, 0.6)', 
        alignSelf: 'flex-start', 
        paddingStart: 10, 
        paddingEnd: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 20, 
        marginTop: 5, 
        marginBottom: 10
    },
    sharedWithStatusReject: {
        backgroundColor: 'rgba(200, 0, 0, 0.6)', 
        alignSelf: 'flex-start', 
        paddingStart: 10, 
        paddingEnd: 10, 
        paddingTop: 2, 
        paddingBottom: 2, 
        borderRadius: 20, 
        marginTop: 5, 
        marginBottom: 10
    },
    sharedWithStatus: {
        fontSize: 12, 
        color: 'white'
    },
    sharedWithButtonsContainer: {
        flex: 0.3, 
        justifyContent: 'space-between', 
        flexDirection: 'row'
    },
    sharedWithButton: {
        padding: 12, 
        alignSelf: 'flex-start',
    }
});