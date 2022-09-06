import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import CreateDataContext from './CreateDataContext';
import Axios from 'axios';
import axios from '../api/ApisConfig';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-root-toast';

const reducer = (state, action) => {
  switch (action.type) {
    case 'signup':
      return {errorMessage: '', token: action.payload};
    case 'signin':
      return {errorMessage: '', token: action.payload};
    case 'signout':
      return {token: null, errorMessage: ''};
    case 'error':
      return {...state, errorMessage: action.payload};
    case 'remove_error_message':
      return {errorMessage: ''};
    default:
      return state;
  }
};

  const signup = (dispatch) => {
  return (email, password, firstname, password_confirmation, c_code, contact, type, lastname, profile_pic, setLoading, callback) => {
    try {
      Axios.post(`${axios.host}${axios.endpoints.register}`, {email, password, firstname, password_confirmation, c_code, contact, type, lastname, profile_pic})
      .then(async(response) => { 
        setLoading(false)
        if(firstname === ''){
          Toast.show('Enter first name', {duration: Toast.durations.LONG, position: -10})
        }
        else if(lastname === ''){
          Toast.show('Enter last name', {duration: Toast.durations.LONG, position: -10})
        }
        else if(contact === ''){
          Toast.show('Enter contact number', {duration: Toast.durations.LONG, position: -10})
        }
        else if(password === ''){
          Toast.show('Enter password', {duration: Toast.durations.LONG, position: -10})
        }
        else{
          callback()
        }
      })
      .catch(error => {
        setLoading(false)
        // error handling
        if(error.response.data.errors.name != undefined){
          Toast.show(error.response.data.errors.name, {duration: Toast.durations.LONG, position: -10})
        }
        else if(error.response.data.errors.password != undefined){
          Toast.show(error.response.data.errors.password, {duration: Toast.durations.LONG, position: -10})
        }
        else if(error.response.data.errors.email != undefined){
          Toast.show(error.response.data.errors.email, {duration: Toast.durations.LONG, position: -10})
        }
        else{
          Toast.show('Same number already exists', {duration: Toast.durations.LONG, position: -10})
        }
      });
    } catch (error) {
      setLoading(false)
      Toast.show('Incorrect credentials', {duration: Toast.durations.LONG, position: -10})
    }
  }
  };

  const signin = (dispatch) => {
    return async (email, password, setLoading, nav_home, nav_liveness) => {
      try {
        const response = await Axios.post(`${axios.host}${axios.endpoints.login}`, {email, password});        
        await AsyncStorage.setItem('Token', response.data.access_token)
        await AsyncStorage.setItem('Id', response.data.user.id.toString())
        await AsyncStorage.setItem('Email', response.data.user.email)
        await AsyncStorage.setItem('F_Name', response.data.user.firstname)
        await AsyncStorage.setItem('L_Name', response.data.user.lastname)
        await AsyncStorage.setItem('C_Code', response.data.user.c_code)
        await AsyncStorage.setItem('Contact', response.data.user.contact)
        await AsyncStorage.setItem('Liveness', response.data.user.liveliness_detection.toString())
        await AsyncStorage.setItem('App_Security', response.data.user.app_security.toString())
        await AsyncStorage.setItem('Album_Security', response.data.user.album_security.toString())
        if(response.data.user.profile === null ){
          await AsyncStorage.setItem('Profile_Pic', '')
        } 
        else {
          await AsyncStorage.setItem('Profile_Pic', response.data.user.profile.access_url)
        }        
        if(response.data.user.app_security.toString() === '1'){
          setLoading(false)
          nav_liveness()
        } 
        else{
          setLoading(false)
          nav_home()
        }
      } 
      catch (error) {
        setLoading(false)
        Toast.show('Incorrect credentials', Toast.LONG);
        dispatch({
          type: 'error',
          payload: 'Incorrect credentials',
        });
      }
    }
  };

  const verify = (dispatch) => {
    return async (email, code, callback) => {
      try {
        await Axios.post(`${axios.host}${axios.endpoints.verify}`, {email, code})
        .then(async(response) => {
          if(response.data === 'Invalid Code'){
            Toast.show('Invalid Code', Toast.LONG);
            dispatch({
              type: 'error',
              payload: 'Invalid Code',
            });
          }
          else if(response.data.user.approved === 0){
            await AsyncStorage.setItem('Token', response.data.access_token)
            await AsyncStorage.setItem('Id', response.data.user.id.toString())
            await AsyncStorage.setItem('Email', response.data.user.email)
            await AsyncStorage.setItem('F_Name', response.data.user.firstname)
            await AsyncStorage.setItem('L_Name', response.data.user.lastname)
            await AsyncStorage.setItem('C_Code', response.data.user.c_code)
            await AsyncStorage.setItem('Contact', response.data.user.contact)
            await AsyncStorage.setItem('Liveness', response.data.user.liveliness_detection.toString())
            await AsyncStorage.setItem('App_Security', response.data.user.app_security.toString())
            await AsyncStorage.setItem('Album_Security', response.data.user.album_security.toString())
            await AsyncStorage.setItem('Profile_Pic', '')
            if (callback) {
              callback()
            }
          }
        })
        .catch((error) => {
          Toast.show('The code field is required', Toast.LONG);
          dispatch({
            type: 'error',
            payload: 'The code field is required',
          });
        })
      } catch (error) {
        console.log(error)
      }
    }
  };

  const forgetPass = (dispatch) => {
    return async (email, callback) => {
      try {
        await Axios.post(`${axios.host}${axios.endpoints.forgetPass}`, {email})
        .then((res) => {
          console.log(res)
          if (callback) {
            callback()
          }
        })
        .catch((err) => {
          Toast.show('Invalid Email', Toast.LONG);
          dispatch({
            type: 'error',
            payload: 'Invalid Email',
          });
        })
      } catch (error) {
        Toast.show(error, Toast.LONG);
        console.log(error)
      }
    }
  };

  const resetPassVer = (dispatch) => {
    return async (email, code, callback) => {
      try {
        await Axios.post(`${axios.host}${axios.endpoints.resetPassVer}`, {email, code})
        .then(async(res) => {
          if(res.data === 'Invalid Code'){
            Toast.show('Invalid Code', Toast.LONG);
            dispatch({
              type: 'error',
              payload: 'Invalid Code',
            });
          } 
          else{
            console.log(res.data.access_token)
            await AsyncStorage.setItem('Token', res.data.access_token);
            if(callback){
              callback()
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
      } catch (error) {
        console.log(error)
      }
    }
  };

  const resetPass = (dispatch) => {
    return async (password, callback) => {
      try {
        await Axios.post(`${axios.host}${axios.endpoints.resetPass}`, {password}, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('Token')}`
          }
        })
        .then((res) => {
          if (callback) {
            callback()
          }
        })
        .catch((err) => {
          Toast.show('Invalid Credentials', Toast.LONG);
          dispatch({
            type: 'error',
            payload: 'Invalid Credentials',
          });
        })
      } catch (error) {
        console.log(error)
      }
    }
  };

  const socialLogin = (dispatch) => {
    return async (email, password, firstname, password_confirmation, c_code, contact, type, lastname, profile_pic, setLoading, nav_home, nav_liveness) => {
      try {
        console.log("PP", profile_pic)
      Axios.post(`${axios.host}${axios.endpoints.register}`, {email, password, firstname, password_confirmation, c_code, contact, type, lastname, profile_pic})
      .then(async(response) => {
        await AsyncStorage.setItem('Token', response.data.access_token)
        await AsyncStorage.setItem('Id', response.data.user.id.toString())
        await AsyncStorage.setItem('Email', response.data.user.email)
        await AsyncStorage.setItem('F_Name', response.data.user.firstname)
        await AsyncStorage.setItem('L_Name', response.data.user.lastname)
        await AsyncStorage.setItem('Liveness', response.data.user.liveliness_detection.toString())
        await AsyncStorage.setItem('App_Security', response.data.user.app_security.toString())
        await AsyncStorage.setItem('Album_Security', response.data.user.album_security.toString())
        if(response.data.user.contact != null){
          await AsyncStorage.setItem('C_Code', response.data.user.c_code)
          await AsyncStorage.setItem('Contact', response.data.user.contact)
        }
        if(response.data.user.profile === null ){
          if(profile_pic === ''){
            await AsyncStorage.setItem('Profile_Pic', profile_pic)
          }
          else{
            RNFetchBlob
            .config({
              fileCache : true,
              appendExt: 'jpg'
            })
            .fetch('GET', profile_pic)
            .then(async(res) => {
              await RNFetchBlob.fs.stat(res.path())
              .then(async(stats) => {
                RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.uploadFile}`, {
                  Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
                  otherHeader: "foo",
                  'Content-Type': 'multipart/form-data',
                }, [
                    { name: 'resource_type', data: 'profile_pic' },
                    { name: 'files', filename: stats.filename, type: 'image/jpg/png/jpeg', data: RNFetchBlob.wrap(res.path()) },      
                  ]).then(async(resp) => { 
                    let obj = JSON.parse('' + resp.data)
                    await AsyncStorage.setItem('Profile_Pic', obj.access_url)
                  }).catch((err) => {
                    console.log(err)
                  })
              })
              .catch((err) => {
                console.log('uploadFiles -> err', err);
              });
            })                
          }
        } 
        else {
          await AsyncStorage.setItem('Profile_Pic', response.data.user.profile.access_url)
        } 
        if(response.data.user.app_security.toString() === '1'){
          setLoading(false)
          nav_liveness()
        } 
        else{
          setLoading(false)
          nav_home()
        }
        })
        .catch((err) => {
          console.log(err)
        })
      } catch (error) {
        dispatch({
          type: 'error',
          payload: 'Something went wrong',
        });
      }
    }
  };

  const uploadProfilePic = (dispatch) => {
    return async (image, resource_type, setLoading, callback) => {
      //upload cover photo
      await RNFetchBlob.fs.stat(image)
      .then(async(stats) => {
        console.log(stats)
        // RNFetchBlob.fetch('POST', `${axios.host}${axios.endpoints.uploadFile}`, {
        //   Authorization: `Bearer ${await AsyncStorage.getItem('Token')}`,
        //   otherHeader: "foo",
        //   'Content-Type': 'multipart/form-data',
        // }, [
        //     { name: 'resource_type', data: resource_type },
        //     { name: 'files', filename: stats.filename, type: 'image/jpg/png/jpeg', data: RNFetchBlob.wrap(image) },      
        //   ]).then(async(resp) => { 
        //     let obj = JSON.parse('' + resp.data)
        //     await AsyncStorage.setItem('Profile_Pic', obj[0].access_url)
        //     if(callback){
        //       setLoading(false)
        //       callback()
        //     }
        //   }).catch((err) => {
        //     console.log(err)
        //   })
      })
      .catch((err) => {
        console.log('uploadFiles -> err', err);
      });
    }
  };

  const signout = (dispatch) => {
    return async (callback) => {
      await AsyncStorage.removeItem('Token');
      await AsyncStorage.removeItem('Id')
      await AsyncStorage.removeItem('F_Name');
      await AsyncStorage.removeItem('L_Name');
      await AsyncStorage.removeItem('Email');
      await AsyncStorage.removeItem('C_Code');
      await AsyncStorage.removeItem('Contact');
      await AsyncStorage.removeItem('Liveness');
      await AsyncStorage.removeItem('App_Security');
      await AsyncStorage.removeItem('Album_Security');
      await AsyncStorage.removeItem('Mail_Counter');
      await AsyncStorage.removeItem('Profile_Pic');
      await AsyncStorage.removeItem('Joined_Users');
      dispatch({
        type: 'signout',
      });
      if (callback) {
        callback()
      }
    }
  };

  const googleSignOut = (dispatch) => {
    return async () => {
      GoogleSignin.configure({});
      try {
        await GoogleSignin.signOut();
      } 
      catch (error) {
        console.error(error);
      }
    }
  };

  const removeErrorMessage = (dispatch) => {
    return() => {
      dispatch({
        type: 'remove_error_message',
      });
    }
  };

  const splashScreen = (dispatch) => {
    return async (navigate_login, navigate_home, navigate_liveness) => {
      const id = await AsyncStorage.getItem('Id');
      const app_security = await AsyncStorage.getItem('App_Security');
      if (id) {
        if(app_security === '1'){
          navigate_liveness()
        } 
        else {
          navigate_home()
        }
      } 
      else {
        navigate_login()
      }
    }
  };

export const { Context, Provider } = CreateDataContext(
  reducer,
  { 
    signup,
    signin,
    verify,
    forgetPass,
    resetPassVer,
    resetPass,
    socialLogin,
    uploadProfilePic,
    signout,
    googleSignOut,
    splashScreen,
    removeErrorMessage,
   },
  [{ errorMessage: '', token: null }]
)
