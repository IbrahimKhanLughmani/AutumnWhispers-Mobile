import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios';
import axios from '../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../context/AlbumContext';
import Realm from 'realm';
import FolderSchema from '../schema/FolderSchema';
import AlbumSchema from '../schema/AlbumSchema';
import SoundSchema from '../schema/SoundSchema';
import PhotoSchema from '../schema/PhotoSchema';
import VideoSchema from '../schema/VideoSchema';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import uuid from 'react-native-uuid';
import Toast from 'react-native-simple-toast';
import { createThumbnail } from "react-native-create-thumbnail";

const MailScreen = () => {
  const {invitation} = useContext(Context);
  const [sharedAlbums, setSharedAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [userID, setUserID] = useState();

  useEffect( async () => {
    setUserID(await AsyncStorage.getItem('Id'))
    getSharedAlbums()  
  }, [soundLoaded, imageLoaded, videoLoaded]);

  const getSharedAlbums = async () => {
    try {
      await Axios.get(`${axios.host}${axios.endpoints.sharedAlbums}`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(res) => {
        setSharedAlbums(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log(error)
    }
  };

  const downloadVideos = async (videos, fe_album_id) => {
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
            .then(response => {
              realm.write(() => {
                const albums = realm.objects('Album'); 
                albums.map((item) => {
                  if(item.fe_album_id === fe_album_id && item.user_id === userID){
                    item.videos.push({fe_video_id, description, cover_path: `file://${res.path()}`, image_path: `file://${response.path}`})
                    console.log('Video created')
                  }
                  if(index === length - 1){
                    getSharedAlbums()
                    setLoading(false)
                  }
                })
              })
            })
          })
        })
    })
  };

  const downloadPhotos = async (photos, fe_album_id) => {
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
  };

  const downloadSounds = async (sounds, fe_album_id) => {
    sounds.map((Sound) => {
      console.log(Sound)
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
          console.log("P", res.path())
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
  };

  const downloadAlbum = async (Album) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    })
    .then(realm => {
      realm.write(async() => {            
        realm.create('Album', {
          user_id: userID, 
          fe_album_id: Album.fe_album_id, 
          share: 'true',
          synced: 'true'
        })
        console.log('Album created in local storage')
        await downloadSounds(Album.sounds, Album.fe_album_id)
        await downloadPhotos(Album.photos, Album.fe_album_id)
        await downloadVideos(Album.videos, Album.fe_album_id)
        if(Album.videos.length === 0){
          getSharedAlbums()
          setLoading(false)
        }
        Toast.show('Saving album, please check your shared memory', Toast.LONG)
      })
    })
  };

  const renderProfilePic = (owner) => {
    if(owner.profile != undefined && owner.profile != null){
      return(
        <Image style={styles.cover} source={{uri: owner.profile.access_url}}/>
      )
    } 
    else{
      return(
        <Image style={styles.cover} source={require('../assets/profile/profile.png')}/>
      )
    }
  };

  const renderSeparator = () => {
    return(
      <View style={{marginBottom: 20}}>
        <Text></Text>
      </View>
    )
  };

  const renderContent = () => {
    if(sharedAlbums.length === 0){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'grey', fontSize: 20, fontWeight: 'bold'}}>There are no invitations</Text>
        </View>
      )
    }
    else{
      return(
        <FlatList
          data={sharedAlbums}
          ListFooterComponent={renderSeparator}
          renderItem={({item})=>{
              if(item.album != null){
                return(
                  <View style={styles.container}>
                      <View style={{flex: 0.2}}>
                        {
                          renderProfilePic(item.owner)
                        }
                      </View>
                      <View style={{flex: 0.8, justifyContent: 'center', marginStart: 20}}>
                        <Text>{item.owner.firstname} {item.owner.lastname} wants to share the album {item.album.name} with you, please select:</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10}}>
                          <TouchableOpacity 
                            style={styles.declineContainer}
                            onPress={()=>{
                              invitation(item.album.fe_album_id, item.owner_id, 'denied')
                              getSharedAlbums()
                            }}>
                            <Text style={{color: 'red'}}>Decline</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.acceptContainer}
                            onPress={async()=>{
                              await invitation(item.album.fe_album_id, item.owner_id, 'accepted')
                              await downloadAlbum(item.album)
                              setLoading(true)
                            }}>
                            <Text style={{color: 'green'}}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                )
              }
          }}
        />
      )
    }
  };

  return(
    <View style={{flex: 1}}>
      { loading ? <Spinner visible={loading}/> : renderContent() }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    flex: 1, 
    marginStart: 20, 
    marginEnd: 20, 
    marginTop: 20
  },
  cover: {
    height: 75, 
    width: 75, 
    backgroundColor: 'silver', 
    borderRadius: 100,
  },
  declineContainer: {
    borderWidth: 0.5, 
    borderColor: 'red', 
    paddingStart: 20, 
    paddingEnd: 20, 
    paddingTop: 5, 
    paddingBottom: 5, 
    borderRadius: 20
  },
  acceptContainer: {
    borderWidth: 0.5, 
    borderColor: 'green', 
    paddingStart: 20, 
    paddingEnd: 20, 
    paddingTop: 5, 
    paddingBottom: 5, 
    borderRadius: 20
  }
  
});

export default MailScreen;