import React, {useState, useEffect} from 'react';
import { StyleSheet, FlatList, Pressable, Image, TouchableOpacity, View, Dimensions, Button, Text, ImageBackground } from 'react-native';
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import {navigate} from '../../navigationRef';
import Realm from 'realm';
import CheckBox from 'react-native-check-box';
import Axios from 'axios';
import axios from '../../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SVGCheck from '../../asset/icons/checked.svg';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Entypo';

const screenWidth = Dimensions.get('window').width;

const PhotoNavigator = ({album, SheetRef, navigation, check, setCheck, selectedPhotos, setSelectedPhotos, photosComponent, setPhotosComponent, photoLoading, setPhotoLoading}) => {

  useEffect(() => {
    navigation.addListener('didFocus', () => {
        getData()
      });
    getData()
    console.log("Photo", photosComponent)
  }, []);

  // get sounds from local storage
  const getData = async () => {
    //set default values when navigated
    setCheck(false)
    setSelectedPhotos([])
    //close bottomSheet
    SheetRef.current.snapTo(2)
    //get sounds from local storage
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    }).then(realm => {
        const albums = realm.objects('Album');
        albums.map((item) => {
          if(item.fe_album_id === album.fe_album_id){
            setPhotosComponent(item.photos)
            setPhotoLoading(false)
          }
      })
    });
  };

  // const getData = async () => {
  //   //set default values when navigated
  //   setCheck(false)
  //   setSelectedPhotos([])
  //   //close bottomSheet
  //   SheetRef.current.snapTo(2)
  //   //get sounds of album
  //   try {
  //       await Axios.get(`${axios.host}${axios.endpoints.sharePhoto}?fe_album_id=${album.fe_album_id}`, {
  //           headers: {
  //             'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
  //           }
  //       })
  //       .then((res) => {
  //           setPhotosComponent(res.data)
  //           setPhotoLoading(false)
  //       })
  //       .catch((err) => {
  //         console.log(err.response.data.message)
  //       })
  //     } catch (error) {
  //       console.log(error)
  //     }
  // };

  const ListItem = ({item, selected, onPress}) => (
    <TouchableOpacity style={styles.albumContainer}>
      <View>
        <ImageBackground style={styles.cover}  source={{uri: item.cover_path}} imageStyle={{ borderRadius: 5}}>
        <View style={styles.highlightDarken}>
          <View style={styles.highlightedAlbumTextContainer}>
            <ModalDropdown 
              options={['Info', 'Share', 'Edit', 'Delete']}
              style={styles.dropMenu}>
                <Icon name="dots-three-vertical" size={18} color="white" />
            </ModalDropdown>
          </View>
        </View>
        <CheckBox
            style={styles.checkbox}
            checkBoxColor='white'
            isChecked={false}
            onClick={onPress}/>
        </ImageBackground>
      </View>
      {selected && 
        <View style={styles.overlay}>
            <SVGCheck height={18} width={18}/>
        </View>}
    </TouchableOpacity>
  );

  const getSelected = contact => selectedPhotos.includes(contact.fe_photo_id);

  const deSelectItems = () => {
    setCheck(false)
    setSelectedPhotos([])
  };

  const selectItems = item => {
    setCheck(true)
    if (selectedPhotos.includes(item.fe_photo_id)) {
      const newListItems = selectedPhotos.filter(
        listItem => listItem !== item.fe_photo_id,
      );
      return setSelectedPhotos([...newListItems]);
    }
    setSelectedPhotos([...selectedPhotos, item.fe_photo_id]);
  };

  const renderStartContent = () => {
    if(album.my_memories === 'true'){
        return(
            <View style={styles.container}>
                <View style={styles.firsthalf}>
                    <Text style={styles.headText1}>There's nothing here yet!</Text>
                    <Text style={styles.headingText2}>Start adding photos to your album by tapping the '+' button below.</Text>
                </View>
                <View style={styles.secondHalf}>
                    <View style={styles.hintContainer1}>
                        <View style={styles.hintContainer2}>
                            <Text style={styles.hintText}>Start adding photos to your album</Text>
                        </View>
                        <View style={styles.hintBotArrow}></View>
                    </View>
                    <TouchableOpacity 
                        style={styles.addBtnContainer}
                        onPress={()=>{
                            navigate('AddPhoto', {album: album})
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
    if(photoLoading === false){
        if(photosComponent.length === 0){
            return renderStartContent()
        } 
        else {
            return(
                check ?
                <Pressable onPress={deSelectItems} style={{flex: 1}}>
                    <FlatList
                        data={photosComponent}
                        numColumns={2}
                        renderItem={({item}) => (
                        <ListItem
                            onPress={() => selectItems(item)}
                            selected={getSelected(item)}
                            item={item}
                        />
                        )}
                        keyExtractor={item => item.fe_photo_id}
                    />
                </Pressable> :
                <FlatList
                  data={photosComponent}
                  numColumns={2}
                  renderItem={({item})=>{
                      return(
                      <TouchableOpacity style={styles.albumContainer}
                          onLongPress={()=>{
                            setCheck(true)
                          }}
                          onPress={()=>{
                              navigate('ShowPhotos', {photo: item})
                          }}>
                          <ImageBackground 
                            style={styles.cover} 
                            imageStyle={{ borderRadius: 5}}
                            source={{uri: item.cover_path}} 
                            resizeMode='cover'>
                              <View style={styles.albumTextContainer}>
                              </View>
                          </ImageBackground>
                      </TouchableOpacity>
                      )
                  }}
              />
            ) 
        }
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  listItem: {
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
      left: 8,
      top: 8,
  },
  container: {
    flex: 1, 
    margin: 20
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
      flex:1, 
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
  highlightedAlbumContainer: {
      height: 150, 
      width: 150, 
      borderWidth: 1, 
      borderRadius: 20
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
  dropMenu: {
      bottom: screenWidth/3 + 5, 
      right: 0,
      alignSelf: 'flex-end'
  },
  highlightedAlbumTextContainer: {
      flex: 1,
      opacity: 0.3, 
      justifyContent: 'flex-end',
      marginBottom: 10,
      marginStart: 10,
      marginEnd: 10,
  },
  imageContainer: {
      width: screenWidth/2 - 20, 
      height: screenWidth/2 - 20,
      borderRadius: 5
  },
  checkbox: {
    position: 'absolute',
    top: 5,
    left: 5, 
    right: 0, 
    bottom: 0,
  },
  tick: {
    height: 20, 
    width: 30
  },
});

export default PhotoNavigator;