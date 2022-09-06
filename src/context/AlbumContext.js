import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateDataContext from './CreateDataContext';
import Axios from 'axios';
import axios from '../api/ApisConfig';
import RNFetchBlob from 'rn-fetch-blob';
import Realm from 'realm';
import FolderSchema from '../schema/FolderSchema';
import AlbumSchema from '../schema/AlbumSchema';
import SoundSchema from '../schema/SoundSchema';
import PhotoSchema from '../schema/PhotoSchema';
import VideoSchema from '../schema/VideoSchema';
import Toast from 'react-native-simple-toast';
import { createThumbnail } from "react-native-create-thumbnail";

const albumReducer = (state, action) => {
  switch (action.type) {
    case 'getAlbum':
      return {album: action.payload};
    case 'createSound':
      return {soundID: action.payload};
    case 'createPhoto':
      return {photoID: action.payload};
    case 'album_loading':
      return {loading: action.payload};
    default:
      return state;
  };
}

const getAlbum = (dispatch) => {
  return async () => {
    try {
      await Axios.get(`${axios.host}${axios.endpoints.createAlbum}`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        // console.log(res.data)
        dispatch({
          type: 'getAlbum',
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log(error)
    }
  }
} 

const createAlbum = (dispatch) => {
  return async (fe_album_id, name, description, liveliness_detection, file_id, share, setLoading, callback) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.createAlbum}`, {fe_album_id, name, description, liveliness_detection, file_id, share, loading: false}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(res) => {
        console.log('Album create in external storage')
        const userID = await AsyncStorage.getItem('Id')
        Realm.open({
          schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
        })
        .then(realm => {
          realm.write(() => {            
            realm.create('Album', {user_id: userID, fe_album_id, share: '0'})
            console.log('Album create in local storage')
            if(callback){
              setLoading(false)
              callback()
            }
          })
        })
      })
    } 
    catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
} 

const albumLoadingController = (dispatch) => {
  return async (fe_album_id, loading) => {
    try {
      await Axios.put(`${axios.host}${axios.endpoints.albumLoading}`, {fe_album_id, loading}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(res) => {
        dispatch({
          type: 'album_loading',
          payload: loading,
        });
        // console.log('status changed')
      })
    } 
    catch (error) {
      console.log(error)
    }
  }
} 

const editAlbum = (dispatch) => {
  return async (fe_album_id, name, description, liveliness_detection, setLoading) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.editAlbum}${fe_album_id}`, {name, description, liveliness_detection},{
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log('album edited')
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.response.data.message)
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
} 

const shareAlbum = (dispatch) => {
  return async (fe_album_id, shared_with, share_date, setLoading, callback) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.shareAlbum}`, {fe_album_id, shared_with, share_date},{
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        setLoading(false)
        Toast.show('Album shared successfully', Toast.LONG)
        callback()
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.response.data.message)
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
} 

const deleteAlbum = (dispatch) => {
  return async (fe_album_id) => {
    try {
      await Axios.delete(`${axios.host}${axios.endpoints.deleteAlbum}${fe_album_id}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log('Album deleted from external storage')
        Realm.open({
          schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
        }).then(realm => {
          realm.write(() => {
            const albums = realm.objects('Album');
            albums.filter((item)=>{      
              if(item != undefined || item != null){
                if(item.fe_album_id === fe_album_id){ 
                  realm.delete(item)
                  console.log('Album deleted from local storage')
                } 
              }         
            })
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log("ERROR", error)
    }
  }
} 

const deleteSharedAlbum = (dispatch) => {
  return async (fe_album_id, shared_with) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.deleteSharedAlbum}`, {fe_album_id, shared_with}, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log("Err", err)
      })
    } catch (error) {
      console.log("ERROR", error)
    }
  }
} 

const deleteSharedFolder = (dispatch) => {
  return async (fe_album_id) => {
    try {
      await Axios.delete(`${axios.host}${axios.endpoints.deleteSharedFolder}${fe_album_id}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log("Err", err)
      })
    } catch (error) {
      console.log("ERROR", error)
    }
  }
}

const saveSound = (dispatch) => {
  return async (fe_album_id, fe_sound_id, description, cover_image, sound, duration, setLoading, callback) => {
    const userID = await AsyncStorage.getItem('Id')
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    })
    .then(realm => {
      realm.write(() => {
        const albums = realm.objects('Album'); 
        albums.map(async(item) => {
          if(item.fe_album_id === fe_album_id){
            item.sounds.push({fe_sound_id, description, sound, cover_image, duration})
            console.log('Sound saved in local storage')
            if(callback){
              setLoading(false)
              callback()
            }
          }
        })
      })
    })
    await RNFetchBlob.fs.stat(sound)
    .then(async(SoundStats) => {
      if(cover_image === ' '){
        RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.shareSound}`, {
          Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
          otherHeader: "foo",
          'Content-Type': 'multipart/form-data',
        }, [
          { name: 'fe_album_id', data: fe_album_id },
          { name: 'fe_sound_id', data: fe_sound_id },
          { name: 'description', data: description },
          { name: 'duration', data: duration },
          { name: 'cover_image', data: cover_image },
          { name: 'files', filename: SoundStats.filename, type: 'mp4/m4a/mp3', data: RNFetchBlob.wrap(sound) },      
          ])
          .then(async(resp) => { 
            console.log('Sound saved in external storage')
          })
      }
      else{
        await RNFetchBlob.fs.stat(cover_image)
        .then(async(CoverStats) => {
          RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.shareSound}`, {
            Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          }, [
            { name: 'fe_album_id', data: fe_album_id },
            { name: 'fe_sound_id', data: fe_sound_id },
            { name: 'description', data: description },
            { name: 'duration', data: duration },
            { name: 'cover_image', filename: CoverStats.filename, type: 'image/foo', data: RNFetchBlob.wrap(cover_image) },      
            { name: 'files', filename: SoundStats.filename, type: 'm4a/mp3/mp4/foo', data: RNFetchBlob.wrap(sound) },      
            ])
            .then(async(resp) => { 
              console.log('Sound saved in external storage')
            })
        })
      }
    })
    .catch((err) => {
      setLoading(false)
      console.log('uploadFiles -> err', err);
    });
  }
} 

const savePhoto = (dispatch) => {
  return async (fe_photo_id, description, fe_album_id, image, setLoading, callback) => {
    //upload cover photo
    await RNFetchBlob.fs.stat(image)
    .then(async(stats) => {
      Realm.open({
        schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
      })
      .then(realm => {
        realm.write(() => {
          const albums = realm.objects('Album'); 
          albums.map(async(item) => {
            if(item.fe_album_id === fe_album_id){
              item.photos.push({fe_photo_id, description, cover_path: image})
              console.log('photo saved in local storage')
              if(callback){
                setLoading(false)
                callback()
              }
            }
          })
        });
      });
      RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.sharePhoto}`, {
        Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, [
        { name: 'fe_photo_id', data: fe_photo_id },
        { name: 'description', data: description },
        { name: 'fe_album_id', data: fe_album_id },
        { name: 'files', filename: stats.filename, type: 'image/jpg/png/jpeg', data: RNFetchBlob.wrap(image) },      
        ]).then(async(res) => { 
          console.log('photo saved in external storage')
        })
    })
    .catch((err) => {
      setLoading(false)
      console.log('uploadFiles -> err', err);
    });
  }
}  

const saveVideo = (dispatch) => {
  return async (fe_album_id, fe_video_id, description, video, setLoading, callback) => {
    //upload cover photo
    await RNFetchBlob.fs.stat(video)
    .then(async(stats) => {
      console.log(video)
      Realm.open({
        schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
      })
      .then(realm => {
        createThumbnail({
          url: video,
          timeStamp: 1000,
        })
        .then(response => {
          realm.write(() => {
            const albums = realm.objects('Album'); 
            albums.map(async(item) => {
              if(item.fe_album_id === fe_album_id){
                item.videos.push({fe_video_id, description, cover_path: video, image_path: response.path})
                console.log('video saved in local storage')
                if(callback){
                  setLoading(false)
                  callback()
                }
              }
            })
          });
        })
      });
      RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.shareVideo}`, {
        Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, [
        { name: 'fe_album_id', data: fe_album_id },
        { name: 'fe_video_id', data: fe_video_id },
        { name: 'description', data: description },
        { name: 'files', filename: stats.filename, type: 'MOV/mp4/video', data: RNFetchBlob.wrap(video) },      
        ]).then(async(resp) => { 
          console.log('video saved in external storage')
          Toast.show('Video saved', Toast.SHORT)
        }).catch((err) => {
          console.log(err)
          setLoading(false)
        })
    })
    .catch((err) => {
      console.log('uploadFiles -> err', err);
      setLoading(false)
    });
  }
}

const deleteSounds = (dispatch) => {
  return async (fe_sound_id, fe_album_id, setSoundsComponent) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    })
    .then(realm => {
      realm.write(() => {
        const albums = realm.objects('Album'); 
        albums.map((item) => {
          if(item.fe_album_id === fe_album_id){
            item.sounds.map((sound) => {
              if(sound != undefined){
                if(sound.fe_sound_id === fe_sound_id){
                  realm.delete(sound)
                  console.log('Sound delete from local storage')
                  Realm.open({
                    schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                  })
                  .then(realm => {
                    const albums = realm.objects('Album');
                    albums.map((item) => {
                      if(item.fe_album_id === fe_album_id){
                        setSoundsComponent(item.sounds)
                      }
                    })
                  })
                } 
              }
            })
          }
        })
      })  
    })
    try {
      await Axios.delete(`${axios.host}${axios.endpoints.deleteSound}${fe_sound_id}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log('Sound delete from external storage')
      })
    } catch (error) {
      console.log(error)
    }
  }
} 

const deletePhotos = (dispatch) => {
  return async (fe_photo_id, fe_album_id, setPhotosComponent) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    })
    .then(realm => {
      realm.write(() => {
        const albums = realm.objects('Album'); 
        albums.map((item) => {
          if(item.fe_album_id === fe_album_id){
            item.photos.map((photo) => {
              if(photo != undefined){
                if(photo.fe_photo_id === fe_photo_id){
                  realm.delete(photo)
                  console.log('Photo delete from local storage')
                  Realm.open({
                    schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                  })
                  .then(realm => {
                    const albums = realm.objects('Album');
                    albums.map((item) => {
                      if(item.fe_album_id === fe_album_id){
                        setPhotosComponent(item.photos)
                      }
                    })
                  })
                } 
              }
            })
          }
        })
      })  
    })
    try {
      await Axios.delete(`${axios.host}${axios.endpoints.deletePhoto}${fe_photo_id}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log('Photo delete from external storage')
      })
    } catch (error) {
      console.log(error)
    }
  }
} 

const deleteVideos = (dispatch) => {
  return async (fe_video_id, fe_album_id, setVideosComponent) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    })
    .then(realm => {
      realm.write(() => {
        const albums = realm.objects('Album'); 
        albums.map((item) => {
          if(item.fe_album_id === fe_album_id){
            item.videos.map((video) => {
              if(video != undefined){
                if(video.fe_video_id === fe_video_id){
                  realm.delete(video)
                  console.log('Video delete from local storage')
                  Realm.open({
                    schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
                  })
                  .then(realm => {
                    const albums = realm.objects('Album');
                    albums.map((item) => {
                      if(item.fe_album_id === fe_album_id){
                        setVideosComponent(item.videos)
                      }
                    })
                  })
                } 
              }
            })
          }
        })
      })  
    })
    try {
      await Axios.delete(`${axios.host}${axios.endpoints.deleteVideo}${fe_video_id}`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log('Video delete from external storage')
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

const uploadFile = (dispatch) => {
  return async (image, fe_album_id, resource_type, setLoading, callback, name, description, liveliness_detection) => {
    //upload cover photo
    await RNFetchBlob.fs.stat(image)
    .then(async(stats) => {
      // console.log(stats)
      RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.uploadFile}`, {
        Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, [
          { name: 'fe_album_id', data: fe_album_id },
          { name: 'resource_type', data: resource_type },
          { name: 'files', filename: stats.filename, type: 'image/jpg/png/jpeg', data: RNFetchBlob.wrap(image) },      
        ]).then((resp) => {    
          var tempMSG = resp.data;  
          tempMSG = tempMSG.replace(/\\/g, '');
          if(callback){
            setLoading(false)
            callback()
          }               
        }).catch((err) => {
          console.log(err)
        })
    })
    .catch(async(err) => {
      console.log('uploadFiles -> err', err);
      try {
        await Axios.post(`${axios.host}${axios.endpoints.editAlbum}${fe_album_id}`, {name, description, liveliness_detection},{
            headers: {
              'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
            }
        })
        .then((res) => {
          if(callback){
            setLoading(false)
            callback()
          }
        })
        .catch((err) => {
          setLoading(false)
          console.log(err.response.data.message)
        })
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    });
  }
} 

const invitation = (dispatch) => {
  return async (fe_album_id, owner_id, status) => {
    try {
      await Axios.put(`${axios.host}${axios.endpoints.invitation}`, {fe_album_id, owner_id, status}, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
      })
      .then((res) => {
        console.log(res.data.message)
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
    } catch (error) {
      console.log(error)
    }
  }
} 

export const { Context, Provider } = CreateDataContext(
  albumReducer,
  { 
    getAlbum,
    albumLoadingController,
    createAlbum,
    editAlbum,
    shareAlbum,
    deleteAlbum,
    deleteSharedAlbum,
    deleteSharedFolder,
    saveSound,
    savePhoto,
    saveVideo,
    deleteSounds,
    deletePhotos,
    deleteVideos,
    uploadFile,
    invitation,
  },
  [{ loading: '', album: [], soundID: '', photoID: '' }]
)
