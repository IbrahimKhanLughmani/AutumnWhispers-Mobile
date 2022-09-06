import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, Dimensions, Pressable, ImageBackground, SafeAreaView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from 'react-native-check-box';
import Realm from 'realm';
import FolderSchema from '../schema/FolderSchema';
import AlbumSchema from '../schema/AlbumSchema';
import SoundSchema from '../schema/SoundSchema';
import PhotoSchema from '../schema/PhotoSchema';
import VideoSchema from '../schema/VideoSchema';
import LinearGradient from "react-native-linear-gradient"
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Entypo';
import SVGCheck from '../asset/icons/checked.svg';
import SVGBack from '../asset/icons/back.svg';
import SVGBg from '../asset/icons/add_album_art.svg';
import { Context } from '../context/AlbumContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import LoadingView from 'react-native-loading-view';

const screenWidth = Dimensions.get('window').width;

const FolderScreen = ({navigation}) => {
  const Folder = navigation.getParam('item')
  const { state, deleteSharedFolder } = useContext(Context);
  const [folder, setFolder] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [check, setCheck] = useState(false);
  const [userID, setUserID] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);

  useEffect( async () => {
    getData()
  }, [state]);

  const getData = async() => {
    setFolder(Folder)
    setUserID(await AsyncStorage.getItem('Id'))
    setLoading(false)
  };

  const downloadVideos = async (videos, fe_album_id, setViewLoading) => {
    const length = videos.length
    videos.map((Video, index) => {
      var fe_video_id = Video.fe_video_id
      var description = Video.description === null ? ' ' : Video.description
      var cover_path = Video.cover_path
      var extention = cover_path.split(".").pop()
      RNFetchBlob
        .config({
          fileCache : true,
          appendExt: extention
        })
        .fetch('GET', cover_path)
        .then((res) => {
          Realm.open({
            schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
          }).then(realm => {
            createThumbnail({
              url: Video.cover_path,
              timeStamp: 1000,
            })
            .then((response) => {
              realm.write(() => {
                const albums = realm.objects('Album'); 
                albums.map(async(item) => {
                  if(item.fe_album_id === fe_album_id && item.user_id === userID){
                    if(Platform.OS === 'android'){
                      await item.videos.push({fe_video_id, description, cover_path: `file://${res.path()}`, image_path: `file://${response.path}`})
                    }
                    else{
                      await item.videos.push({fe_video_id, description, cover_path: res.path(), image_path: `file://${response.path}`})
                    }
                    console.log('Video created')
                    if(index === length - 1){
                      await setViewLoading(false)
                    }
                  }
                })
              })
            })
          })
        })
    })
  };

  const downloadPhotos = async (photos, fe_album_id, callback) => {
    photos.map((Photo) => {
      var fe_photo_id = Photo.fe_photo_id
      var description = Photo.description === null ? ' ' : Photo.description
      var cover_path = Photo.cover_path
      var extention = cover_path.split(".").pop()
      RNFetchBlob
        .config({
          fileCache : true,
          appendExt: extention
        })
        .fetch('GET', cover_path)
        .then((res) => {
          Realm.open({
            schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
          }).then(realm => {
            realm.write(() => {
              const albums = realm.objects('Album'); 
              albums.map((item) => {
                if(item.fe_album_id === fe_album_id && item.user_id === userID){
                  item.photos.push({fe_photo_id, description, cover_path: `file://${res.path()}`})
                  console.log('Photo created')
                }
              })
            })
          })
        })
    })
    callback()
  };

  const downloadSounds = async (sounds, fe_album_id, callback) => {
    sounds.map((Sound) => {
      var fe_sound_id = Sound.fe_sound_id
      var description = Sound.description === null ? ' ' : Sound.description
      var sound = Sound.cover_path
      var extention = sound.split(".").pop()
      var cover_image = Sound.cover_image === null ? ' ' : Sound.cover_image
      var duration = `${Sound.duration}`
      RNFetchBlob
        .config({
          fileCache : true,
          appendExt: extention
        })
        .fetch('GET', sound)
        .then((res) => {
          Realm.open({
            schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
          })
          .then(realm => {
            realm.write(() => {
            const albums = realm.objects('Album')
              albums.map((item) => {
                if(item.fe_album_id === fe_album_id && item.user_id === userID){
                  item.sounds.push({fe_sound_id, description, sound: res.path(), cover_image, duration})
                  console.log('Sound created')
                }
              })
            })
          })
        })
      })
      callback()
  };

  const downloadAlbum = async (album) => {
    if(viewLoading === true){
      try {
        Realm.open({
          schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
        })
        .then(async realm => {
          realm.write(() => {            
            realm.create('Album', {
              user_id: userID, 
              fe_album_id: album.fe_album_id, 
              share: 'true',
              synced: 'false'
            })
            console.log('Album created in local storage')
          })
          downloadSounds(album.sounds, album.fe_album_id, ()=>{downloadPhotos(album.photos, album.fe_album_id, ()=>{downloadVideos(album.videos, album.fe_album_id, setViewLoading)})})
        })
      } 
      catch (error) {
        console.log(error)
      }
    }
  };

  const renderAlbumContent = (item) => {
    return(
      <TouchableOpacity style={styles.albumContainer} 
        onLongPress={()=>{
          setCheck(true)
        }}
        onPress={()=>{
          if(item.album.liveliness_detection === 0){
            navigation.navigate('Album', {
              item: item.album
            })
          }
          else{
            navigation.navigate('VerifyDetection', {
              root_nav: item.album
            })
          }         
        }}>
        <ImageBackground 
          style={styles.cover} 
          imageStyle={{ borderRadius: 10}}
          source={item.album.cover_path === null ? require('../assets/album/album.png') : {uri: item.album.cover_path}} 
          resizeMode='cover'>
          <LinearGradient 
              colors={['#00000000', '#231F20']} 
              style={{height : '100%', width : '100%', borderRadius: 10}}>
                <View style={styles.albumTextContainer}>
                  {/* <ModalDropdown 
                    options={['Info', 'Share', 'Edit', 'Delete']}
                    dropdownStyle={{height: 140, width: 75}}
                    dropdownTextStyle={{color: '#343c71'}}
                    dropdownTextHighlightStyle={{color: '#343c71'}}
                    animated
                    style={styles.dropMenu}>
                      <Icon name="dots-three-vertical" size={18} color="white" />
                  </ModalDropdown> */}
                  <Text style={styles.albumText}>{item.album.name}</Text>
                </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    )
  };

  const resetValues = () => {
    setCheck(false)
    setSelectedAlbum([])
  };

  const ListItem = ({item, selected, onPress}) => (
    <TouchableOpacity
      style={styles.albumContainer}
      onPress={()=>{
        onPress()
      }}>
      <View>
        <ImageBackground 
          style={styles.cover} 
          imageStyle={{ borderRadius: 10}}
          source={item.album.cover_path === null ? require('../assets/album/album.png') : {uri: item.album.cover_path}} 
          resizeMode='cover'>
          <View style={styles.highlightDarken}>
            <View style={styles.highlightedAlbumTextContainer}>
              <ModalDropdown 
                options={['Info', 'Share', 'Edit', 'Delete']}
                style={styles.dropMenu}>
                  <Icon name="dots-three-vertical" size={18} color="white" />
              </ModalDropdown>
              <Text style={styles.albumText}>{item.album.name}</Text>
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
  
  const getSelected = contact => selectedAlbum.includes(contact.album.fe_album_id);
  
  const deSelectItems = () => {
    setCheck(false)
    setSelectedAlbum([])
  };

  const selectItems = item => {
    setCheck(true)
    if (selectedAlbum.includes(item.album.fe_album_id)) {
      const newListItems = selectedAlbum.filter(
        listItem => listItem !== item.album.fe_album_id,
      );
      return setSelectedAlbum([...newListItems]);
    }
    setSelectedAlbum([...selectedAlbum, item.album.fe_album_id]);
  };

  const renderHeader = () => {
    if(check === true){
      return(
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>{
            resetValues()
          }}>
            <Image style={styles.close} source={require('../assets/album/header/close.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            if(selectedAlbum != undefined){
              selectedAlbum.map(async(item) => {
                setCheck(false)
                await deleteSharedFolder(item)
                getData()
              })
            }
            if(selectedFolder != undefined){
              selectedFolder.map((item) => {
                delete_Folder(item)
              })
            }
          }}>
              <Image style={styles.bin} source={require('../assets/album/header/bin.png')}/>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return(
        <View style={styles.headerInfoContainer}>
            <TouchableOpacity
              style={{flex: 0.1}}
              onPress={()=>{
                navigation.pop()
              }}>
                <SVGBack height={18} width={18}/>
            </TouchableOpacity>
            <View style={{flex: 0.8}}>
              <Text style={styles.headerText}>{Folder[0].owner.firstname}'s Albums</Text>
            </View>
            <View style={{flex: 0.1}}>

            </View>
        </View>
      )
    }
  };

  const renderContent = () => {
    if(loading === false){
      if(folder.length === 0){
        return(
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View>
              <View style={{alignItems: 'center'}}>
                <SVGBg height={250} width={300}/>
                <Text style={styles.centerText}>This folder is empty now!</Text>
              </View>
            </View>
          </View>
        )
      } 
      else {
        if(check == true){
          return(
            <Pressable onPress={deSelectItems} style={{flex: 1}}>
              <FlatList
                  data={folder}
                  numColumns={2}
                  renderItem={({item}) => (
                  <ListItem
                      onPress={()=>selectItems(item)}
                      selected={getSelected(item)}
                      item={item}
                  />
                  )}
                  keyExtractor={item => item.album.fe_album_id}
              />
            </Pressable>
          )
        }
        else{
          return(
            <FlatList
            data={folder}
            numColumns={2}
            renderItem={({item})=>{
              Realm.open({
                schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
              }).then(realm => {
                realm.write(() => {
                  const albums = realm.objects('Album');
                  var isFound = albums.some(element => {
                    if (element.fe_album_id === item.album.fe_album_id && element.user_id === userID) {
                      return true;
                    }
                  });
                  isFound === false ? downloadAlbum(item.album) : null
                })
              });
              return(
                renderAlbumContent(item) 
              ) 
            }}
          />
          )
        }
      }
    }
  };

  return(
    <View style={{flex: 1}}>
      <Spinner visible={loading}/>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 0.075}}>
          { renderHeader() }
        </View>
        <View style={{flex: 0.925}}>
          { renderContent() }
        </View>
      </SafeAreaView>
    </View>
  )
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
    headerText: {
        textAlign: 'center', 
        color: '#343c71', 
        fontSize: 20, 
        fontWeight: 'bold',
        paddingEnd: 5,
    },
    overlay: {
        position: 'absolute',
        left: 8,
        top: 8,
    },
    albumContainer: {
        width: screenWidth/2 - 20, 
        borderRadius: 10,
        marginEnd: 10,
        marginStart: 10,
        marginTop: 20,
    },
    cover: {
        width: screenWidth/2 - 20, 
        height: screenWidth/2 - 20, 
    },
    albumTextContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
    },
    dropMenu: {
        bottom: screenWidth/3 - 20, 
        right: 0,
        alignSelf: 'flex-end'
    },
    albumText: {
        color: 'white', 
        fontSize: 18,
        textAlign: 'center'
    },
    highlightedAlbumTextContainer: {
        flex: 1,
        opacity: 0.3, 
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
    },
    highlightDarken: {
        width: screenWidth/2 - 20, 
        height: screenWidth/2 - 20, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        borderRadius: 10
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
      width: 30,
    },
    close: {
        height: 10, 
        width: 10, 
        padding: 8,
        marginStart: 20
    },
    bin: {
        height: 15, 
        width: 15, 
        padding: 10,
        marginEnd: 20,
    },
    centerText: {
        color: '#343c71', 
        marginStart: 40,
        marginEnd: 40, 
        textAlign: 'center'
    }
});

export default FolderScreen;