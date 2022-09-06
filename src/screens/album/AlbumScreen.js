import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, ImageBackground, Text, SafeAreaView} from 'react-native';
import AlbumHeader from '../../components/AlbumHeader';
import AlbumNav from '../../components/AlbumNav';
import InfoNavigator from '../../components/album/InfoNavigator';
import VideoNavigator from '../../components/album/VideoNavigator';
import PhotoNavigator from '../../components/album/PhotoNavigator';
import SoundNavigator from '../../components/album/SoundNavigator';
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import Realm from 'realm';
import { Context } from '../../context/AlbumContext';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios';
import axios from '../../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import uuid from 'react-native-uuid';
import SVGBack from '../../asset/icons/back.svg';
import SVGHome from '../../asset/icons/home.svg';
import SVGShare from '../../asset/icons/share.svg';
import SVGDelete from '../../asset/icons/delete.svg';
import SVGClose from '../../asset/icons/close.svg';
import SVGEdit from '../../asset/icons/edit.svg';
import SVGInfo from '../../asset/icons/info.svg';
import { createThumbnail } from "react-native-create-thumbnail";

const AlbumScreen = ({navigation}) => {
    const {deleteSounds, deletePhotos, deleteVideos} = useContext(Context);
    const [sounds, setSounds] = useState(true);
    const [photos, setPhotos] = useState(false);
    const [videos, setVideos] = useState(false);
    const [info, setInfo] = useState(false);
    const SheetRef = useRef();
    const album = navigation.getParam('item');
    const shared = navigation.getParam('shared');
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    //sound variables
    const [selectedSounds, setSelectedSounds] = useState([]);
    const [soundsComponent, setSoundsComponent] = useState([]);
    const [soundLoading, setSoundLoading] = useState(true);
    //photo variables
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [photosComponent, setPhotosComponent] = useState([]);
    const [photoLoading, setPhotoLoading] = useState(true);
    //video variables
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [videosComponent, setVideosComponent] = useState([]);
    const [videoLoading, setVideoLoading] = useState(true);

    useEffect(async() => {
        console.log(album.fe_album_id)
        await getPermission()
        await checkUpdate()
    }, []);

    //checking update in albums content for shared album
    const checkUpdate = async () => {
        if(shared === undefined){
            try {
                await Axios.get(`${axios.host}${axios.endpoints.getAlbumById}${album.fe_album_id}`, {
                  headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
                  }
                })
                .then(async(res) => {
                    Realm.open({
                        schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                    })
                    .then(realm => {
                        realm.write(() => {
                            const albums = realm.objects('Album');
                            const Album = albums.filter((item) => {
                            return item.fe_album_id === album.fe_album_id
                        })
                        checkSoundUpdate(res.data[0].sounds, Album[0].sounds)
                        checkPhotoUpdate(res.data[0].photos, Album[0].photos)
                        checkVideoUpdate(res.data[0].videos, Album[0].videos)
                        })
                    });
                })
                .catch((err) => {
                  console.log(err)
                })
              } catch (error) {
                console.log(error)
              }
        }
    };

    const checkSoundUpdate = (server_sound, local_sound) => {
        server_sound.map((Sound) => {
            const found = local_sound.some(el => el.fe_sound_id === Sound.fe_sound_id)
            if(found){
                console.log("Sound", `${Sound.description} found`)
            } 
            else{
                var fe_sound_id = Sound.fe_sound_id
                var description = Sound.description === null ? ' ' : Sound.description
                var sound = Sound.cover_path
                var extention = sound.split(".").pop()
                var cover_image = Sound.cover_image === null ? ' ' : Sound.cover_image
                var duration = Sound.duration
                RNFetchBlob
                .config({
                    fileCache : true,
                    appendExt: extention
                })
                .fetch('GET', sound)
                .then(async(res) => {
                    Realm.open({
                        schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                    }).then(realm => {
                        realm.write(() => {
                            const albums = realm.objects('Album'); 
                            albums.map(async(item) => {
                                if(item.fe_album_id === album.fe_album_id){
                                    var isFound = item.sounds.some(element => {
                                        if (element.fe_sound_id === fe_sound_id) {
                                            return true;
                                        }
                                    });
                                    isFound === false ? item.sounds.push({fe_sound_id, description, sound: res.path(), cover_image, duration}) : null
                                }
                            })
                        })
                    })
                })
            }
        })
    };

    const checkPhotoUpdate = (server_photo, local_photo) => {
        server_photo.map((Photo) => {
            const found = local_photo.some(el => el.fe_photo_id === Photo.fe_photo_id)
            if(found){
                console.log("Photo", `${Photo.description} found`)
            } 
            else{
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
                .then(async(res) => {
                    Realm.open({
                        schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                    }).then(realm => {
                        realm.write(() => {
                            const albums = realm.objects('Album'); 
                            albums.map(async(item) => {
                                if(item.fe_album_id === album.fe_album_id){
                                    var isFound = item.photos.some(element => {
                                        if (element.fe_photo_id === fe_photo_id) {
                                            return true;
                                        }
                                    });
                                    isFound === false ? item.photos.push({fe_photo_id, description, cover_path: `file://${res.path()}`}) : null
                                }
                            })
                        })
                    })
                })
            }
        })
    };

    const checkVideoUpdate = (server_video, local_video) => {
        server_video.map((Video) => {
            const found = local_video.some(el => el.fe_video_id === Video.fe_video_id)
            if(found){
                console.log("Video", `${Video.description} found`)
            } 
            else{
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
                    .then(async(res) => {
                        createThumbnail({
                            url: Video.cover_path,
                            timeStamp: 1000,
                        })
                        .then((response) => {
                            Realm.open({
                                schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                            }).then(realm => {
                                realm.write(() => {
                                    const albums = realm.objects('Album'); 
                                    albums.map(async(item) => {
                                        if(item.fe_album_id === album.fe_album_id){
                                            if(item.fe_album_id === album.fe_album_id){
                                                var isFound = item.videos.some(element => {
                                                    if (element.fe_video_id === fe_video_id) {
                                                        return true;
                                                    }
                                                });
                                                isFound === false ? (
                                                    Platform.OS === 'android' ? 
                                                        await item.videos.push({fe_video_id, description, cover_path: `file://${res.path()}`, image_path: `file://${response.path}`}) 
                                                            : await item.videos.push({fe_video_id, description, cover_path: res.path(), image_path: `file://${response.path}`})
                                                ) : null
                                            }
                                        }
                                    })
                                })
                            })
                        })
                })
            }
        })
    };

    const getPermission = async () => {
        if(Platform.OS === 'android'){
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);         
                if (
                  grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                  grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid. RESULTS.GRANTED &&
                  grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                  //permission granted
                } else {
                  //permission not granted
                  return;
                }
              } catch (err) {
                console.warn(err);
                return;
              }        
        }
    };
    
    const resetValues = () => {
        setCheck(false)
        setSelectedSounds([])
        setSelectedPhotos([])
        setSelectedVideos([])
    };

    const renderHeader = () => {
        if(check === false){
            if(info === true){
                return(
                    <View style={styles.headerInfoContainer}>
                        <TouchableOpacity 
                            style={{padding: 10}}
                            onPress={()=>{
                                navigation.pop()
                            }}>
                            <SVGBack height={18} width={18}/>
                        </TouchableOpacity>
                        {
                            shared ?
                            <TouchableOpacity 
                                style={{padding: 10}}
                                onPress={()=>{
                                    navigation.navigate('EditAlbum', {album: album})
                                }}>
                                <SVGEdit height={18} width={18}/>
                            </TouchableOpacity> : null
                        }
                    </View>
                )
            }
            else{
                return(
                    <View style={styles.headerContainer}>
                        <View style={styles.headerBackBtnContainer}>
                            <TouchableOpacity 
                                style={styles.headerBtn}
                                onPress={()=>{navigation.pop()}}>
                                <SVGBack height={18} width={18}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTextContainer}>
                            { renderAlbumName() }
                        </View>
                        <View style={styles.headerMoreContainer}>
                            {/* <TouchableOpacity 
                                style={styles.headerBtn}
                                onPress={()=>{
                                    navigation.navigate('Home')
                                }}>
                                <SVGHome height={18} width={18}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.headerBtn}
                                onPress={()=>{
                                    navigation.navigate('AlbumInfo', {album: album})
                                }}>
                                <SVGShare height={18} width={18}/>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                )
            }
        }
        else{
            return(
                <View style={styles.headerHighlight}>
                    <TouchableOpacity
                        style={{padding: 10}} 
                        onPress={()=>{
                            resetValues()
                        }}>
                        <SVGClose height={15} width={15}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{padding: 10}}
                        onPress={()=>{
                            if(sounds){
                                selectedSounds.map(async(item) => {
                                    await deleteSounds(item, album.fe_album_id, setSoundsComponent)
                                })
                                setCheck(false)
                            }
                            else if(photos){
                                selectedPhotos.map(async(item) => {
                                    await deletePhotos(item, album.fe_album_id, setPhotosComponent)
                                })
                                setCheck(false)
                            }
                            else if(videos){
                                selectedVideos.map(async(item) => {
                                    await deleteVideos(item, album.fe_album_id, setVideosComponent)
                                })
                                setCheck(false)
                            }
                        }}>
                        <SVGDelete height={18} width={18}/>
                    </TouchableOpacity>
                </View>
            )
        }
    };

    const renderAlbumName = () => {
        var length = album.name.length
        var short_name = album.name.slice(0, 12)
        if(length <= 12){
            return (
                <TouchableOpacity 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=>{
                        navigation.navigate('AlbumInfo', {
                            album: album,
                            shared: shared
                          })
                    }}>
                    <Text style={styles.headerText}>{album.name}</Text>
                    {/* <SVGInfo height={15} width={15}/> */}
                </TouchableOpacity>
            )
        }
        else{
            return(
                <TouchableOpacity 
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=>{
                        navigation.navigate('AlbumInfo', {
                            album: album,
                            shared: shared
                          })
                    }}>
                    <Text style={styles.headerText}>{short_name}...</Text>
                    <SVGInfo height={15} width={15}/>
                </TouchableOpacity>
            )
        }
    };

    const renderContent = () => {
        if(sounds){
            return(  
                <SoundNavigator 
                    album={album} 
                    SheetRef={SheetRef} 
                    navigation={navigation} 
                    check={check} 
                    setCheck={setCheck}
                    selectedSounds={selectedSounds}
                    setSelectedSounds={setSelectedSounds}
                    soundsComponent={soundsComponent}
                    setSoundsComponent={setSoundsComponent}
                    soundLoading={soundLoading}
                    setSoundLoading={setSoundLoading}
                />
            )
        } else if(photos){
            return(
                <PhotoNavigator 
                    album={album} 
                    SheetRef={SheetRef} 
                    navigation={navigation} 
                    check={check} 
                    setCheck={setCheck}
                    selectedPhotos={selectedPhotos}
                    setSelectedPhotos={setSelectedPhotos}
                    photosComponent={photosComponent}
                    setPhotosComponent={setPhotosComponent}
                    photoLoading={photoLoading}
                    setPhotoLoading={setPhotoLoading}
                />
            )
        } else if(videos){
            return(
                <VideoNavigator 
                    album={album} 
                    SheetRef={SheetRef} 
                    navigation={navigation} 
                    check={check} 
                    setCheck={setCheck}
                    selectedVideos={selectedVideos}
                    setSelectedVideos={setSelectedVideos}
                    videosComponent={videosComponent}
                    setVideosComponent={setVideosComponent}
                    videoLoading={videoLoading}
                    setVideoLoading={setVideoLoading}
                />
            )
        }else if(info){
            return(
                <InfoNavigator 
                    album={album} 
                    shared={shared}
                    SheetRef={SheetRef} 
                    navigation={navigation}
                />
            )
        }
    };

    return(
        <View style={{flex: 1}}>
            <Spinner visible={loading}/>
            <View style={{flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={{flex: 0.075}}>
                        { renderHeader() }
                    </View>
                    <View style={{flex: 0.075}}>
                        <AlbumHeader 
                            navigation={navigation}
                            sounds={sounds}
                            setSounds={setSounds}
                            photos={photos}
                            setPhotos={setPhotos}
                            videos={videos}
                            setVideos={setVideos}
                            info={info}
                            setInfo={setInfo}
                        />
                    </View>
                    <View style={{flex: 0.85}}>
                        {
                            loading ? null : renderContent()
                        }
                    </View>
                </SafeAreaView>
                <View style={{flex: 0.1}}>
                    <AlbumNav 
                        SheetRef={SheetRef} 
                        album={album}
                        info={info}
                        shared={shared}
                        setSounds={setSounds}
                        setPhotos={setPhotos}
                        setVideos={setVideos}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15
    },
    icon: {
        height: 25, 
        width: 25, 
    },
    close: {
        height: 15, 
        width: 15, 
    },
    bin: {
        height: 20, 
        width: 20, 
    },
    more: {
        height: 10, 
        width: 10, 
        padding: 10,
    },
    headerInfoContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginStart: 10, 
        marginEnd: 10
    },
    headerContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    headerBackBtnContainer: {
        flex: 0.25, 
        justifyContent: 'center', 
        paddingStart: 10
    },
    headerTextContainer: {
        flex: 0.5, 
        justifyContent: 'center'
    },
    headerText: {
        textAlign: 'center', 
        color: 'black', 
        fontSize: 20, 
        fontWeight: 'bold',
        paddingEnd: 5,
    },
    headerMoreContainer: {
        flex: 0.25, 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        alignItems: 'center'
    },
    headerBtn: {
        height: 30, 
        width: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    headerHighlight: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginStart: 10, 
        marginEnd: 10
    }
});

export default AlbumScreen;
