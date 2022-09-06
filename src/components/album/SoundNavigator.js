import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Pressable, FlatList, Image, ImageBackground, Dimensions} from 'react-native';
import {navigate} from '../../navigationRef';
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import Realm from 'realm';
import CheckBox from 'react-native-check-box';
import Axios from 'axios';
import axios from '../../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Entypo';
import SVGCheck from '../../asset/icons/checked.svg';
import LinearGradient from "react-native-linear-gradient"

const screenWidth = Dimensions.get('window').width;

const SoundNavigator = ({album, SheetRef, navigation, check, setCheck, selectedSounds, setSelectedSounds, soundsComponent, setSoundsComponent, soundLoading, setSoundLoading}) => {

    useEffect(() => {
        navigation.addListener('didFocus', () => {
            getData()
          });
        getData()
        console.log("Sounds", soundsComponent)
    }, []);
    
    //get sounds from local storage
    const getData = async () => {
        //set default values when navigated
        setCheck(false)
        setSelectedSounds([])
        //close bottomSheet
        SheetRef.current.snapTo(2)
        //get sounds from local storage
        Realm.open({
            schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
        }).then(realm => {
            const albums = realm.objects('Album');
            albums.map((item) => {
                if(item.fe_album_id === album.fe_album_id){
                    setSoundsComponent(item.sounds)
                    setSoundLoading(false)
                }
            })
        });
    };

    // const getData = async () => {
    //     //set default values when navigated
    //     setCheck(false)
    //     setSelectedSounds([])
    //     //close bottomSheet
    //     SheetRef.current.snapTo(2)
    //     //get sounds of album
    //     try {
    //         await Axios.get(`${axios.host}${axios.endpoints.shareSound}?fe_album_id=${album.fe_album_id}`, {
    //             headers: {
    //               'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
    //             }
    //         })
    //         .then((res) => {
    //             setSoundsComponent(res.data)
    //             setSoundLoading(false)
    //         })
    //         .catch((err) => {
    //           console.log(err.response.data.message)
    //         })
    //       } catch (error) {
    //         console.log(error)
    //       }
    // };    

    const ListItem = ({item, selected, onPress, onLongPress}) => (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.albumContainer}>
           <ImageBackground 
                style={styles.cover} 
                imageStyle={{ borderRadius: 10}}
                source={item.cover_image === null || item.cover_image=== ' ' ? require('../../assets/album/unnamed.jpeg') : {uri: item.cover_image}} 
                resizeMode='cover'>
                <LinearGradient 
                    colors={['#00000000', '#231F20']} 
                    style={{height : '100%', width : '100%', borderRadius: 10}}>
                    <View style={styles.albumTextContainer}>
                        {item.description ? <Text style={styles.albumText}>{item.description}</Text> : <Text style={styles.albumText}>No Title</Text>}
                        <Text style={styles.text1}>Duration: {item.duration}</Text>
                    </View>
                </LinearGradient>
                <CheckBox
                style={styles.checkbox}
                checkBoxColor='white'
                isChecked={false}
                onClick={onPress}/>
            </ImageBackground>
            {selected && 
                <View style={styles.overlay}>
                    <SVGCheck height={18} width={18}/>
                </View>}
        </TouchableOpacity>
    );
    
    const getSelected = contact => selectedSounds.includes(contact.fe_sound_id);
    
    const deSelectItems = () => {
        setCheck(false)
        setSelectedSounds([])
    };
    
    const selectItems = item => {
        if (selectedSounds.includes(item.fe_sound_id)) {
            const newListItems = selectedSounds.filter(
            listItem => listItem !== item.fe_sound_id,
            );
            return setSelectedSounds([...newListItems]);
        }
        setSelectedSounds([...selectedSounds, item.fe_sound_id]);
    };

    const renderStartContent = () => {
        if(album.my_memories === 'true'){
            return(
                <View style={styles.container}>
                    <View style={styles.firsthalf}>
                        <Text style={styles.headText1}>There's nothing here yet!</Text>
                        <Text style={styles.headingText2}>Start adding sounds to your album by tapping the '+' button below.</Text>
                    </View>
                    <View style={styles.secondHalf}>
                        <View style={styles.hintContainer1}>
                            <View style={styles.hintContainer2}>
                                <Text style={styles.hintText}>Start adding sounds to your album</Text>
                            </View>
                            <View style={styles.hintBotArrow}></View>
                        </View>
                        <TouchableOpacity 
                            style={styles.addBtnContainer}
                            onPress={()=>{
                                navigate('AddAudio', {album: album})
                            }}>
                            <Text style={styles.addBtnText}>+  Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else{
            return(
                <View style={styles.container}>
                    <View style={{flex: 1, justifyContent: 'center', margin: 20}}>
                        <Text style={styles.headText1}>There's nothing here yet!</Text>
                    </View>
                </View>
            )
        }
    };

    const renderContent = () => {
        if(soundLoading === false){
            if(soundsComponent.length === 0){
                return renderStartContent()
            } else {
                return(            
                    check ?
                    <Pressable onPress={deSelectItems} style={{flex: 1}}>
                        <FlatList
                            data={soundsComponent}
                            numColumns={2}
                            renderItem={({item}) => (
                            <ListItem
                                onPress={()=>selectItems(item)}
                                selected={getSelected(item)}
                                item={item}
                            />
                            )}
                            keyExtractor={item => item.fe_sound_id}
                        />
                    </Pressable> :
                     <FlatList
                        data={soundsComponent}
                        numColumns={2}
                        renderItem={({item})=>{
                            return(
                                <TouchableOpacity style={styles.albumContainer} 
                                  onLongPress={()=>{
                                    setCheck(true)
                                  }}
                                  onPress={()=>{
                                    navigate('PlayAudio', {album: album, sound: item})
                                  }}>
                                <ImageBackground 
                                    style={styles.cover} 
                                    imageStyle={{ borderRadius: 10}}
                                    source={item.cover_image === null || item.cover_image=== ' ' ? require('../../assets/album/unnamed.jpeg') : {uri: item.cover_image}} 
                                    resizeMode='cover'>
                                    <LinearGradient 
                                        colors={['#00000000', '#231F20']} 
                                        style={{height : '100%', width : '100%', borderRadius: 10}}>
                                        <View style={styles.albumTextContainer}>
                                            {item.description ? <Text style={styles.albumText}>{item.description}</Text> : <Text style={styles.albumText}>No Title</Text>}
                                            <Text style={styles.text1}>Duration: {item.duration}</Text>
                                        </View>
                                    </LinearGradient>
                                </ImageBackground>
                            </TouchableOpacity>
                         )
                     }}
                   />        
                )
            }
        }
    };

    return(
        <TouchableOpacity 
            activeOpacity={1}
            style={{flex: 1}}
            onPress={()=>{
                SheetRef.current.snapTo(2)
            }}>
            {
               renderContent()
            }
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        margin: 20
    },
    overlay: {
        position: 'absolute',
        left: 8,
        top: 8,
      },
    firsthalf: {
        flex: 0.5, 
        justifyContent: 'center', 
        margin: 20
    },
    headText1: {
        fontWeight: 'bold', 
        textAlign: 'center',
        color: '#58a279',
        fontSize: 22,
    },
    headingText2: {
        textAlign: 'center',
        color: '#58a279'
    },
    secondHalf: {
        flex: 0.5, 
        justifyContent: 'flex-end', 
        alignItems: 'flex-end'
    },
    hintContainer1: {
        flex: 1, 
        justifyContent: 'flex-end', 
        alignItems:'flex-end'
    },
    hintContainer2: {
        width: 200, 
        height: 80, 
        backgroundColor: '#58a279', 
        borderRadius: 10
    },
    hintText: {
        color: 'white', 
        padding: 20, 
        textAlign: 'center'
    },
    hintBotArrow: {
        transform:[{rotateZ:'45deg'}], 
        width: 15, 
        height: 15, 
        backgroundColor: '#58a279',
        marginTop:-8, 
        marginRight: 20
    },
    addBtnContainer: {
        width: 75, 
        backgroundColor: '#58a279', 
        padding: 10, 
        borderRadius: 20, 
        marginTop: 20
    },
    addBtnText: {
        color: 'white', 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    mediaPlayer: {
        flexDirection: 'row', 
        height: 75, 
        marginStart: 20,
        marginTop: 10,
    },
    cover: {
        width: screenWidth/2 - 20, 
        height: screenWidth/2 - 20, 
    },
    highlightDarken: {
        width: screenWidth/2 - 20, 
        height: screenWidth/2 - 20, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        borderRadius: 10
    },
    albumContainer: {
        width: screenWidth/2 - 20, 
        borderRadius: 10,
        marginEnd: 10,
        marginStart: 10,
        marginTop: 20,
    },
    albumTextContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
    },
    albumText: {
        color: 'white', 
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    dropMenu: {
        bottom: 0, 
        right: -5,
        alignSelf: 'flex-end'
    },
    checkbox: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    tick: {
        height: 20, 
        width: 30,
    },
    textContainer: {
    },
    text1: {
        color: 'white', 
        fontSize: 14,
        textAlign: 'center'
    },
    text3: {
        color: '#58a279',
        textAlign: 'center',
        fontSize: 12
    },
    moreContainer: {
        flex: 0.1, 
        justifyContent: 'center', 
        alignItems: 'flex-end',
        paddingEnd: 20
    },
    more: {
        height: 15, 
        width: 15,
    },
    toggleContainer: {
        flex: 0.2,
        marginStart: 40,
        marginEnd: 40,
        backgroundColor: 'white', 
        borderRadius: 10
      },
      toggleTitle: {
        marginStart: 20,
        marginEnd: 20,
        marginTop: 20,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      toggleText: {
        textAlign: 'center',
        marginStart: 20,
        marginEnd: 20,
        marginTop: 5,
        marginBottom: 10
      },
      btnContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
      },
      cancelBtn: {
        padding: 10
      },
      cancelBtnText: {
        color: 'blue'
      },
      deleteBtn: {
        padding: 10
      },
      deleteBtnText: {
        color: 'red',
        fontWeight: 'bold',
      }
})

export default SoundNavigator;