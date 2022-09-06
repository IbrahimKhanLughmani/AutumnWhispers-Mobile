import React, {useRef, useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList, Platform, Dimensions, Pressable, ImageBackground, SafeAreaView} from 'react-native';
import HomeHeader from '../components/HomeHeader';
import SVGBg from '../asset/icons/add_album_art.svg';
import SVGCheck from '../asset/icons/checked.svg';
import SVGMenu from '../asset/icons/menu.svg';
import SVGClose from '../asset/icons/close.svg';
import SVGDelete from '../asset/icons/delete.svg';
import SVGMail from '../assets/home_screen/email_green.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';
import { Context } from '../context/AlbumContext';
import { Badge } from 'react-native-elements'
import Axios from 'axios';
import axios from '../api/ApisConfig';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import AppNav from '../components/AppNav';
import LinearGradient from "react-native-linear-gradient"
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Entypo';
import SideMenu from 'react-native-side-menu-updated';
import AccountScreen from '../components/AccountScreen';
import HomeNav from '../components/HomeNav';
import { StackActions, NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Realm from 'realm';
import FolderSchema from '../schema/FolderSchema';
import AlbumSchema from '../schema/AlbumSchema';
import SoundSchema from '../schema/SoundSchema';
import PhotoSchema from '../schema/PhotoSchema';
import VideoSchema from '../schema/VideoSchema';
import LoadingView from 'react-native-loading-view';
import RNFetchBlob from 'rn-fetch-blob';
import { createThumbnail } from "react-native-create-thumbnail";

Icon.loadFont()
const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
    const { state, deleteAlbum, albumLoadingController } = useContext(Context);
    const [MyMemories, setMyMemories] = useState(true);
    const [SharedMemories, setSharedMemories] = useState(false);
    const [image, setImage] = useState('');
    const [greeting, setGreeting] = useState({
      name: '',
      greeting: ''
    });
    const [folders, setFolders] = useState({realm: null});
    const [albums, setAlbums] = useState({realm: null});
    const [localAlbums, setLocalAlbums] = useState();
    const [loading, setLoading] = useState(true);
    const [viewLoading, setViewLoading] = useState(true);
    const SheetRef = useRef(null);
    const [selectedAlbum, setSelectedAlbum] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState([]);
    const [check, setCheck] = useState(false);
    const [counter, setCounter] = useState(0);
    const [userID, setUserID] = useState();
    const [menu, setMenu] = useState(false);
    const nav_home = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Signin' })],
    });

    useEffect( async () => {
      navigation.addListener('didFocus', async() => {
        await getName()
        await getAlbums()
        await getLocalAlbums()
        await getSharedFolders()
        await checkNewMail()
      });
      console.log(await AsyncStorage.getItem('Token'))
      await getName()
      await getAlbums()
      await getLocalAlbums()
      await getSharedFolders()
      await checkNewMail()
      setLoading(false)
    }, [state]);

    const getName = async () => {
      //set user id
      setUserID(await AsyncStorage.getItem('Id'))
      //get profile pic
      setImage(await AsyncStorage.getItem('Profile_Pic'))
      //setting greeting time and name
      const name = await AsyncStorage.getItem('F_Name')
      const hours = new Date().getHours();
      if(hours < 12){
        setGreeting({name: name, greeting: 'Good Morning'})
      } 
      else if(hours >= 12 && hours < 18){
        setGreeting({name: name, greeting: 'Good Afternoon'})
      }
      else if(hours >= 18 && hours < 24){
        setGreeting({name: name, greeting: 'Good Evening'})
      }
    };

    const getAlbums = async() => {
      try {
        await Axios.get(`${axios.host}${axios.endpoints.getAlbum}`, {
            headers: {
              'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
            }
        })
        .then((res) => {
          setAlbums(res.data)
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })
      } catch (error) {
        console.log(error)
      }
    };

    const getLocalAlbums = async() => {
      const userID = await AsyncStorage.getItem('Id')
      try {
        Realm.open({
          schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
        }).then(realm => {
          realm.write(() => {
            //get data from local storage
            const albums = realm.objects('Album');
            const user_albums = albums.filter((item) => {
              return item.user_id === userID
            })
            setLocalAlbums(user_albums)
          })
        });
      } catch (error) {
        console.log(error)
      }
    };

    const getSharedFolders = async() => {
      try {
        await Axios.get(`${axios.host}${axios.endpoints.getSharedAlbums}`, {
            headers: {
              'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
            }
        })
        .then((res) => {
          setFolders(res.data)
        })
      } catch (error) {
        console.log(error)
      }
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
                        await albumLoadingController(fe_album_id, false)
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

    const downloadAlbum = async (fe_album_id) => {
      if(viewLoading === true){
        try {
          await Axios.get(`${axios.host}${axios.endpoints.getAlbumById}${fe_album_id}`, {
            headers: {
              'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
            }
          })
          .then(async(res) => {
            Realm.open({
              schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
            })
            .then(async realm => {
              realm.write(() => {            
                realm.create('Album', {
                  user_id: userID, 
                  fe_album_id, 
                  share: 'false',
                })
                console.log('Album created in local storage')
              })
              res.data[0].videos.length === 0 ? albumLoadingController(fe_album_id, false) : albumLoadingController(fe_album_id, true)
              downloadSounds(res.data[0].sounds, fe_album_id, ()=>{downloadPhotos(res.data[0].photos, fe_album_id, ()=>{downloadVideos(res.data[0].videos, fe_album_id, setViewLoading)})})
            })
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
            disabled={item.loading === true ? true : false}
            onLongPress={()=>{ setCheck(true) }}
            onPress={()=>{ navigation.navigate('Album', { item: item, shared: MyMemories }) }}>
              <ImageBackground 
                style={styles.cover} 
                imageStyle={{ borderRadius: 10}}
                source={item.cover_path === null ? require('../assets/album/album.png') : {uri: item.cover_path}} 
                resizeMode='cover'>
                <LinearGradient 
                    colors={['#00000000', '#231F20']} 
                    style={{height : '100%', width : '100%', borderRadius: 10}}>
                      <View style={styles.albumTextContainer}>
                        <LoadingView style={{flex: 1, marginTop: 20}} loading={item.loading}>
                          {/* <ModalDropdown 
                            options={['Info', 'Share', 'Edit', 'Delete']}
                            dropdownStyle={{height: 140, width: 75}}
                            dropdownTextStyle={{color: '#343c71'}}
                            dropdownTextHighlightStyle={{color: '#343c71'}}
                            animated
                            style={styles.dropMenu}>
                              <Icon name="dots-three-vertical" size={18} color="white" />
                          </ModalDropdown> */}
                          <Text style={styles.albumText}>{item.name}</Text>
                        </LoadingView>
                      </View>
                </LinearGradient>
              </ImageBackground>
        </TouchableOpacity>
      )
    };

    const checkNewMail = async () => {
      try {
        await Axios.get(`${axios.host}${axios.endpoints.sharedAlbums}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
        })
        .then(async(res) => {
          setCounter(res.data.length)
        })
        .catch((err) => {
          console.log(err)
        })
      } catch (error) {
        console.log(error)
      }
    };

    const resetValues = () => {
      setCheck(false)
      setSelectedAlbum([])
      setSelectedFolder([])
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
            source={item.cover_path === null ? require('../assets/album/album.png') : {uri: item.cover_path}} 
            resizeMode='cover'>
            <View style={styles.highlightDarken}>
              <View style={styles.highlightedAlbumTextContainer}>
                <ModalDropdown 
                  options={['Info', 'Share', 'Edit', 'Delete']}
                  style={styles.dropMenu}>
                    <Icon name="dots-three-vertical" size={18} color="white" />
                </ModalDropdown>
                <Text style={styles.albumText}>{item.name}</Text>
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
    
    const getSelected = contact => selectedAlbum.includes(contact.fe_album_id);
    
    const deSelectItems = () => {
      setCheck(false)
      setSelectedAlbum([])
    };

    const selectItems = item => {
      setCheck(true)
      if (selectedAlbum.includes(item.fe_album_id)) {
        const newListItems = selectedAlbum.filter(
          listItem => listItem !== item.fe_album_id,
        );
        return setSelectedAlbum([...newListItems]);
      }
      setSelectedAlbum([...selectedAlbum, item.fe_album_id]);
    };

    const checkMemoryContent = () => {
      if(loading === false){
        if(albums.length === 0){
          return(
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View>
                <View style={{alignItems: 'center'}}>
                  <SVGBg height={250} width={300}/>
                  <Text style={styles.centerText}>Before you add memories, you'll need a memory album to store them in.</Text>
                </View>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={async() => {
                    const trackingStatus = await requestTrackingPermission();
                    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
                      navigation.navigate('CreateAlbum')
                    } else{
                      navigation.navigate('CreateAlbum')
                    }
                  }}
                  underlayColor='#fff'>
                      <Text style={styles.buttonText}>Create a memory album!</Text>
                </TouchableOpacity>
              </View>
            </View> 
          )
        } 
        else {
          return(
            check ?
            <Pressable onPress={deSelectItems} style={{flex: 1}}>
                <FlatList
                    data={albums}
                    numColumns={2}
                    renderItem={({item}) => (
                    <ListItem
                        onPress={()=>selectItems(item)}
                        selected={getSelected(item)}
                        item={item}
                    />
                    )}
                    keyExtractor={item => item.fe_album_id}
                />
            </Pressable> :
            <FlatList
              data={albums}
              numColumns={2}
              renderItem={({item})=>{
                Realm.open({
                  schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                }).then(realm => {
                  realm.write(() => {
                    const albums = realm.objects('Album');
                    var isFound = albums.some(element => {
                      if (element.fe_album_id === item.fe_album_id && element.user_id === userID) {
                        return true;
                      }
                    });
                    isFound === false ? downloadAlbum(item.fe_album_id) : null
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
    };
    
    const checkSharedContent = () => {
      // checkNewMail()    
      if(loading === false){
        if(folders.length === 0){
          return(
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View>
                <View style={{alignItems: 'center'}}>
                  <SVGBg height={250} width={300}/>
                  <Text style={styles.centerText}>When someone share their memories with you, they'll appear here!</Text>
                </View>
              </View>
            </View>
          )
        } 
        else {
          return(
            <FlatList
              data={folders}
              numColumns={2}
              renderItem={({item})=>{
                return(
                  <TouchableOpacity style={styles.albumContainer} 
                    disabled={item.loading === true ? true : false}
                    onLongPress={()=>{ setCheck(true) }}
                    onPress={()=>{ navigation.navigate('Folder', { item: item.albums }) }}>
                      <ImageBackground 
                        style={styles.cover} 
                        imageStyle={{ borderRadius: 10}}
                        source={item.owner.profile === null ? require('../assets/profile/profile.png') : {uri: item.owner.profile.access_url}} 
                        resizeMode='cover'>
                        <LinearGradient 
                            colors={['#00000000', '#231F20']} 
                            style={{height : '100%', width : '100%', borderRadius: 10}}>
                              <View style={styles.albumTextContainer}>
                                <LoadingView style={{flex: 1, marginTop: 20}} loading={item.loading}>
                                  {/* <ModalDropdown 
                                    options={['Info', 'Share', 'Edit', 'Delete']}
                                    dropdownStyle={{height: 140, width: 75}}
                                    dropdownTextStyle={{color: '#343c71'}}
                                    dropdownTextHighlightStyle={{color: '#343c71'}}
                                    animated
                                    style={styles.dropMenu}>
                                      <Icon name="dots-three-vertical" size={18} color="white" />
                                  </ModalDropdown> */}
                                  <Text style={styles.albumText}>{item.owner.firstname} {item.owner.lastname}</Text>
                                </LoadingView>
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

    const navigationToCreateScreen = () => {
      navigation.navigate('CreateAlbum')
      SheetRef.current.snapTo(2)
    };

    const renderHeader = () => {
      if(check === true){
        if(MyMemories === true){
          return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity 
                style={{padding: 10}}
                onPress={()=>{
                  resetValues()
                }}>
                <SVGClose style={{marginStart: 10}} height={15} width={15}/>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{padding: 10}}
                onPress={()=>{
                  if(selectedAlbum != undefined){
                    selectedAlbum.map(async(item) => {
                      setCheck(false)
                      await deleteAlbum(item)
                      getAlbums()
                    })
                  }
              }}>
                <SVGDelete style={{marginEnd: 10}} height={18} width={18}/>
              </TouchableOpacity>
            </View>
          )
        }
      }
      else{
        if(counter > 0){                              
          return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity
                style={{flex: 0.8}}
                onPress={() => {
                  navigation.navigate('Account')
                }}>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginStart: 10}}>
                    {/* {
                      image ?
                      <Image style={styles.profile_pic} source={{uri: image}}/> :
                      <Image style={styles.img} source={require('../asset/icons/profile/profile.png')}/>
                    } */}
                    <View style={styles.headerPadding}>
                      <Text style={styles.greeting}>{greeting.greeting}</Text>
                      <Text style={styles.name}>{greeting.name}</Text>
                    </View>
                  </View>
              </TouchableOpacity>
              <View style={{flex: 0.2, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{flex: 1, alignItems: 'flex-end', paddingTop: 5, paddingEnd: 20, paddingBottom: 5}}
                  onPress={() => {
                    navigation.navigate('Mail')
                  }}>
                    <SVGMail height={23} width={23}/>
                    <Badge
                      value={counter}
                      status="success"
                      badgeStyle={{height: 18, width: 18, borderRadius: 100, backgroundColor: 'red'}}
                      containerStyle={styles.badgeContainer}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{flex: 0.5, alignItems: 'center', marginEnd: 0, paddingTop: 5, paddingBottom: 5}}
                  onPress={() => {
                    setMenu(true)
                  }}>
                    <SVGMenu height={22} width={22}/>
                </TouchableOpacity> */}
              </View>
            </View>
          )
        }
        else{
          return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TouchableOpacity
                style={{flex: 0.8}}
                onPress={() => {
                  setCounter(false)
                  navigation.navigate('EditAccount')
                }}>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginStart: 10}}>
                    {/* {
                      image ?
                      <Image style={styles.profile_pic} source={{uri: image}}/> :
                      <Image style={styles.img} source={require('../asset/icons/profile/profile.png')}/>
                    } */}
                    <View style={styles.headerPadding}>
                      <Text style={styles.greeting}>{greeting.greeting}</Text>
                      <Text style={styles.name}>{greeting.name}</Text>
                    </View>
                  </View>
              </TouchableOpacity>
              <View style={{flex: 0.2, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{flex: 1, alignItems: 'flex-end', paddingTop: 5, paddingEnd: 20, paddingBottom: 5}}
                  onPress={() => {
                    navigation.navigate('Mail')
                  }}>
                    <SVGMail height={23} width={23}/>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{flex: 0.5, alignItems: 'center', marginEnd: 0, paddingTop: 5, paddingBottom: 5}}
                  onPress={() => {
                    setMenu(true)
                  }}>
                    <SVGMenu height={22} width={22}/>
                </TouchableOpacity> */}
              </View>
            </View>
          )
        }
      }
    };

    return(
      <>
        <Spinner visible={loading}/>
        <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 0.9}}>
            <View style={{flex: 0.075}}>
              { renderHeader() }
            </View>
            <View style={{flex: 0.075}}>
                <HomeHeader 
                  MyMemories={MyMemories}
                  setMyMemories={setMyMemories}
                  SharedMemories={SharedMemories}
                  setSharedMemories={setSharedMemories}
                />
            </View>
            <TouchableOpacity 
              activeOpacity={1} 
              style={{flex: 0.85}} 
              onPress={()=>{
                SheetRef.current.snapTo(2)
              }}>
              {
                MyMemories ? checkMemoryContent() : checkSharedContent()
              }
            </TouchableOpacity>
          </SafeAreaView>
          <View style={{flex: 0.1}}>
            {/* <AppNav SheetRef={SheetRef} navigationToCreateScreen={navigationToCreateScreen}/> */}
            <HomeNav SheetRef={SheetRef} navigationToCreateScreen={navigationToCreateScreen}/>
          </View>
        </View>
      </>
    )
};

const styles = StyleSheet.create({
    headerPadding:{
      paddingStart: 10,
    },
    greeting:{
      color: 'black',
      fontSize: 12,
      fontStyle: 'italic'
    },
    img: {
      height: 40, 
      width: 40,
      borderRadius: 100 ,
    },
    profile_pic: {
      height: 40, 
      width: 40,
      borderRadius: 100 ,
    },
    name:{
      fontWeight: 'bold',
      color: 'black',
      fontSize: 15,
    },
    tinyLogo: {
      width: 25,
      height: 25,
      marginEnd: 20,
    },
    badgeContainer: {
      position: 'absolute', 
      top: -2, 
      right: 10
    },
    container: {
      flex: 1, 
      backgroundColor: 'white', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 15
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
    highlightedAlbumTextContainer: {
      flex: 1,
      opacity: 0.3, 
      justifyContent: 'flex-end',
      marginBottom: 10,
      marginStart: 10,
      marginEnd: 10,
    },
    albumText: {
      color: 'white', 
      fontSize: 18,
      textAlign: 'center'
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
    buttonContainer: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 20,
      height: 45,
      backgroundColor: '#58a279',
      borderRadius: 10,
    },
    buttonText: {
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
    centerText: {
      color: 'grey', 
      marginStart: 40,
      marginEnd: 40, 
      textAlign: 'center'
    },
    sharedAlbumPicContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end', 
      marginStart: 10,
    },
    pictureSharedAlbum: {
      height: 65, 
      width: 65,
      borderRadius: 100,
      borderWidth: 5,
      borderColor: '#efefef',
      position: 'absolute',
      right: -17, 
      bottom: -17,
    }
});

export default HomeScreen;