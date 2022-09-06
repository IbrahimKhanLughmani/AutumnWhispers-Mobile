import {navigate} from '../navigationRef';
import CreateDataContext from './CreateDataContext';
import Axios from 'axios';
import axios from '../api/ApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';

const reducer = (state, action) => {
  switch (action.type) {
    case 'user_info':
      return {userInfo: {
        email: action.payload.email,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        c_code: action.payload.c_code,
        contact: action.payload.contact,
        profile_pic: action.payload.profile.access_url,
      }};
    case 'joined':
      return {...state, joined: action.payload};
    
    default:
      return state;
  }
};

const getProfile = (dispatch) => {
  return async () => {
    try {
      await Axios.get(`${axios.host}${axios.endpoints.getProfile}`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(response) => {
        console.log(response.data)
        await AsyncStorage.setItem('Id', response.data.user.id.toString())
        await AsyncStorage.setItem('Email', response.data.email)
        await AsyncStorage.setItem('F_Name', response.data.firstname)
        await AsyncStorage.setItem('L_Name', response.data.lastname)
        await AsyncStorage.setItem('C_Code', response.data.c_code)
        await AsyncStorage.setItem('Contact', response.data.contact)
        await AsyncStorage.setItem('Liveness', response.data.liveliness_detection.toString())
        await AsyncStorage.setItem('App_Security', response.data.app_security.toString())
        await AsyncStorage.setItem('Album_Security', response.data.album_security.toString())
      })
      .catch((err) => {
        console.log(err.response)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const updateProfile = (dispatch) => {
  return async (email, c_code, contact, firstname, lastname, setLoading, callback) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.updateProfile}`, {email, c_code, contact, firstname, lastname}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(response) => {
        console.log(response.data)
        await AsyncStorage.setItem('Id', response.data.id.toString())
        await AsyncStorage.setItem('Email', response.data.email)
        await AsyncStorage.setItem('F_Name', response.data.firstname)
        await AsyncStorage.setItem('L_Name', response.data.lastname)
        await AsyncStorage.setItem('C_Code', response.data.c_code)
        await AsyncStorage.setItem('Contact', response.data.contact)
        //till backend developer fixes default value of liveliness_detection
        if(response.data.liveliness_detection === null ){
          await AsyncStorage.setItem('Liveness', '0')
        } 
        else {
          await AsyncStorage.setItem('Liveness', response.data.liveliness_detection.toString())
        }
        await AsyncStorage.setItem('App_Security', response.data.app_security.toString())
        await AsyncStorage.setItem('Album_Security', response.data.album_security.toString())
        if(callback){
          callback()
        }
      })
      .catch((err) => {
        Toast.show(err.response.data.errors[0], Toast.LONG)
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
      console.log("Error", error)
    }
  }
};

const updateContacts = (dispatch) => {
  return async (contacts) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.updateContact}`, contacts, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        console.log("Response", res.data)
      })
      .catch((err) => {
        console.log("ERR", err.response.data.message)
        console.log("ERR", err.response.data.error)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const joinedContacts = (dispatch) => {
  return async (contacts) => {
    try {
      await Axios.get(`${axios.host}${axios.endpoints.joinedContact}`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`,
        }
      })
      .then((res) => {
        console.log(res.data)
        dispatch({
          type: 'joined',
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const deleteJoinedContacts = (dispatch) => {
  return async (contact) => {
    try {
      await Axios.post(`https://awnode-api.filesdna.com/api/user/delete-contacts`, {contact}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        Toast.show('User removed', Toast.LONG)
      })
      .catch((err) => {
        console.log("err", err.response.data)
      })
    } catch (error) {
      console.log("ERR", error)
    }
  }
};

const contactUs = (dispatch) => {
  return async (title, content, callback) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.contactUs}`, {title, content}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`,
        }
      })
      .then((res) => {
        Toast.show('Thanks for your feedback', Toast.LONG)
        callback()      
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const setLivenessDetection = (dispatch) => {
  return async (email, liveliness_detection) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.updateProfile}`, {email, liveliness_detection}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then((res) => {
        AsyncStorage.setItem('Liveness', liveliness_detection)
      })
      .catch((err) => {
        console.log(err.response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const AppSecurity = (dispatch) => {
  return async (app_security) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.updateProfile}`, {app_security}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(res) => {
        console.log(res.data)
        await AsyncStorage.setItem('App_Security', app_security) 
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const AlbumSecurity = (dispatch) => {
  return async (album_security) => {
    try {
      await Axios.post(`${axios.host}${axios.endpoints.updateProfile}`, {album_security}, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
        }
      })
      .then(async(res) => {
        console.log(res.data)
        await AsyncStorage.setItem('Album_Security', album_security) 
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
      console.log(error)
    }
  }
};

const uploadFile = (dispatch) => {
  return async (image, resource_type, setLoading, callback, email, c_code, contact, firstname, lastname) => {
    //upload cover photo
    await RNFetchBlob.fs.stat(image)
    .then(async(stats) => {
      // console.log(stats)
      RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.uploadFile}`, {
        Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
        otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, [
          { name: 'resource_type', data: resource_type },
          { name: 'files', filename: stats.filename, type: 'image/jpg/png/jpeg', data: RNFetchBlob.wrap(image) },      
        ]).then(async(resp) => { 
          let obj = JSON.parse('' + resp.data)
          await AsyncStorage.setItem('Profile_Pic', obj[0].access_url)
          if(callback){
            setLoading(false)
            callback()
          }
        }).catch((err) => {
          setLoading(false)
          console.log(err)
        })
    })
    .catch(async(err) => {
      console.log('uploadFiles -> err', err);
      try {
        await Axios.post(`${axios.host}${axios.endpoints.updateProfile}`, {email, c_code, contact, firstname, lastname}, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
        })
        .then(async(response) => {
          console.log(response.data)
          await AsyncStorage.setItem('Id', response.data.id.toString())
          await AsyncStorage.setItem('Email', response.data.email)
          await AsyncStorage.setItem('F_Name', response.data.firstname)
          await AsyncStorage.setItem('L_Name', response.data.lastname)
          await AsyncStorage.setItem('C_Code', response.data.c_code)
          await AsyncStorage.setItem('Contact', response.data.contact)
          //till backend developer fixes default value of liveliness_detection
          if(response.data.liveliness_detection === null ){
            await AsyncStorage.setItem('Liveness', '0')
          } 
          else {
            await AsyncStorage.setItem('Liveness', response.data.liveliness_detection.toString())
          }
          await AsyncStorage.setItem('App_Security', response.data.app_security.toString())
          await AsyncStorage.setItem('Album_Security', response.data.album_security.toString())
          if(callback){
            callback()
          }
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    });
  }
};

export const { Context, Provider } = CreateDataContext(
  reducer,
  { 
    getProfile,
    updateProfile,
    updateContacts,
    joinedContacts,
    deleteJoinedContacts,
    contactUs,
    setLivenessDetection,
    AppSecurity,
    AlbumSecurity,
    uploadFile,
   },
  [{ joined: '' }, {userInfo: {email: '', firstname: '', lastname: '', c_code: '', contact: '', profile_pic: ''}}]
)
