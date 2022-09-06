  import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform} from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask'
import { Context } from '../../context/UserContext';
import axios from '../../api/LivenessApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '../../components/Checkbox'
import LivenessModal from '../../components/LivenessModal';
import Toast from 'react-native-root-toast';
import SVGBg from '../../assets/liveliness/verified.svg'

const LivenessDetection = () => {
    const [liveness, setLiveness] = useState('0');
    const {AppSecurity, AlbumSecurity, setLivenessDetection} = useContext(Context);
    const [loader, setLoader] = useState(false);
    const cameraRef = useRef();
    const [status, setStatus] = useState('');
    const [state, setState] = useState({
      isCamera: false,
      isEnrolled: false,
      isVerified: false,
      livenessData: '',
      type: 'enroll',
      picture: '',
    });
    const {
      isCamera, type
    } = state;
    const [appSecurity, setAppSecurity] = useState(false)
    const [albumSecurity, setAlbumSecurity] = useState(false)
    const [modal, setModal] = useState(false);

    useEffect(async() => {  
      getData()
    }, []);

    const getData = async() => {
      setLiveness(await AsyncStorage.getItem('Liveness'))
      let AppSec = await AsyncStorage.getItem('App_Security')
      let AlbumSec = await AsyncStorage.getItem('Album_Security')
      if(AppSec === '0'){
        setAppSecurity(false)
      } else{
        setAppSecurity(true)
      }
      if(AlbumSec === '0'){
        setAlbumSecurity(false)
      } else{
        setAlbumSecurity(true)
      }
    };

    const takePicture = async (value) => {
      setLoader(true);
      if (value) {
        const options = {
          quality: 0.5,
          base64: true,
          skipProcessing: false,
          target: 'disk',
          fixOrientation: true,
          doNotSave: true,
          width: 640,
        };
        console.log('')
        const data = await value.takePictureAsync(options);
        // console.log('ðŸš€ ~ file: index.js ~ line 60 ~ takePicture ~ data', data);
        if (data) {
          enrollLiveness(data);
        }
      }
    };

    const enrollLiveness = async (data, rType) => {
      const email = await AsyncStorage.getItem('Email'); 
      const base64 = `data:image/png;base64,${data.base64}`;
      const iData = {
        name: email || '',
      };
      if (rType !== 'reset') {
        iData.image = base64;
      }
      let endPoint = `${axios.host}${axios.endpoints.enroll}`;
      if (rType === 'reset') {
        endPoint = `${axios.host}${axios.endpoints.remove}`;
      } else if (type === 'enroll') {
        endPoint = `${axios.host}${axios.endpoints.enroll}`;
      } else {
        endPoint = `${axios.host}${axios.endpoints.verify}`;
      }
      fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(iData)
      }).then((response) => response.json())
        .then((response) => {
          if(response.status === 'Go Back'){
            Toast.show('Move away from camera', {duration: Toast.durations.SHORT, position: -100})
          }
          else if(response.status === 'Move Closer'){
            Toast.show('Come closer to camera', {duration: Toast.durations.SHORT, position: -100})
          }
          else{
            Toast.show(response.status, {duration: Toast.durations.SHORT, position: -100})
          }
          if(type === 'enroll' && (response?.status === 'Go Back' || response?.status === 'No Face Detected' || response.status === 'Move Closer' || response.status === 'Verify Failed')){
            setTimeout(() => {takePicture(cameraRef.current)}, 5000)
          }
          if(type === 'enroll' && (response?.status === 'Enroll OK')){
            setState((p) => ({...p, isCamera: false, isEnrolled: true, picture: base64, type: 'verify'}))
            setLiveness('1')
            setLivenessDetection(iData.name, '1')
          }
          if(type === 'verify' && (response?.status === 'Go Back' || response?.status === 'No Face Detected' || response.status === 'Move Closer')){
            setTimeout(() => {takePicture(cameraRef.current)}, 5000);
          }
          if(type === 'verify' && response.status === 'Verify Failed'){
            setState((p) => ({...p, isCamera: false, isEnrolled: true, picture: base64}))
          }
          if(type === 'verify' && (response?.status === 'Verify OK')){
            setState((p) => ({...p, isCamera: false, isVerified: true, livenessData: response?.liveness, picture: base64}));
            setLiveness('2')
            setLivenessDetection(iData.name, '2')
          }
          if (rType === 'reset') {
            setState((p) => ({...p, isVerified: false, picture: '', isEnrolled: false, type: 'enroll'}))
            setLiveness('0')
            setLivenessDetection(iData.name, '0')
            AppSecurity('0')
            AlbumSecurity('0')
          }
        }).catch((err) => {
          setLoader(false);
          setState((p) => ({ ...p, isCamera: false }));
          console.log('uploadProof -> err', err);
        });
    };

    const setVerifiedTag = () => {
      if(liveness === '2'){
        return(
          <View style={{borderWidth: 1, borderColor: '#58a279', borderRadius: 5, backgroundColor: '#c8e6c9', justifyContent: 'center'}}>
            <Text style={{paddingStart: 5, paddingEnd: 5, fontSize: 10, color: '#58a279'}}>Verified</Text>
          </View>
        )
      } else{
        return null
      }
    };

    const renderCheckBox = () => {
      if(liveness === '2'){
        return(
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View>
              <Checkbox 
                selected={appSecurity} 
                onPress={handleCheckBoxApp}
                text='App Secuity'
                checkValue={appSecurity}
                changeCheckValue={setAppSecurity}
                security={AppSecurity}
                setModal={setModal}
              />
            </View>
            <View>
              <Checkbox 
                selected={albumSecurity} 
                onPress={handleCheckBoxAlbum}
                text='Album Security'
                checkValue={albumSecurity}
                changeCheckValue={setAlbumSecurity}
                security={AlbumSecurity}
                setModal={setModal}
              />
            </View>
          </View>
        )
      }
    };

    const renderEnrollBtn = () => {
      if(liveness === '0'){
        return(
          <TouchableOpacity 
            style={styles.enrollBtn} 
            onPress={()=>{
              if (Platform.OS === 'ios') {
                setTimeout(() => {takePicture(cameraRef.current)}, 5000)
                setState((p) => ({ ...p, isCamera: !isCamera, type: 'enroll' }))
              }
              else{
                setTimeout(() => {takePicture(cameraRef.current)}, 1500)
                setState((p) => ({ ...p, isCamera: !isCamera, type: 'enroll' }))
              }
            }}>
              <Text style={styles.enrollBtnText}>Enroll</Text>
          </TouchableOpacity>
        )
      } 
      else{
        return(
          <TouchableOpacity 
            style={styles.removeBtn} 
            onPress={()=>{
              enrollLiveness('', 'reset')
            }}>
              <Text style={styles.removeBtnText}>Remove User</Text>
          </TouchableOpacity>
        )
      }
    };

    const renderVerifyBtn = () => {
      return(
        <TouchableOpacity 
          style={styles.verifyBtn} 
          onPress={()=>{
            if(liveness === '0'){
              Toast.show('Please enroll first', {duration: Toast.durations.SHORT, position: -100})
            }
            else{
              if (Platform.OS === 'ios') {
                setTimeout(() => {takePicture(cameraRef.current)}, 5000)
                setState((p) => ({ ...p, isCamera: !isCamera, type: 'verify' }))
              }
              else{
                setTimeout(() => {takePicture(cameraRef.current)}, 1500)
                setState((p) => ({ ...p, isCamera: !isCamera, type: 'verify' }))
              }
            }
          }}>
            <Text style={styles.verifyBtnText}>Verify</Text>
        </TouchableOpacity>
      )
    }

    const handleCheckBoxApp = async () => {
      setAppSecurity(!appSecurity)
      if(appSecurity === false){
        AppSecurity('1')
      }
      else{
        AppSecurity('0')
      }
    };

    const handleCheckBoxAlbum = () => {
      setAlbumSecurity(!albumSecurity)
      if(albumSecurity === false){
        AlbumSecurity('1')
      }
      else{
        AlbumSecurity('0')
      }
    };

    return(
      <>
        <LivenessModal modal={modal} setModal={setModal}/> 
        <View style={{flex: 1}}>
            <View style={{flex: 0.15, paddingStart: 10, paddingTop: 10, paddingEnd: 10}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Liveness Check</Text>
                {
                  setVerifiedTag()
                }
              </View>
              <Text style={{fontWeight: 'bold'}}>Test your Liveness</Text>
              <Text style={{paddingBottom: 20}}>Please enroll/verify your face by scanning it in front of the camera.</Text>
            </View>
            <View style={{flex: 0.65}}>
              {
                isCamera ?
                (
                  <View style={styles.cameraContainer}>
                    <RNCamera
                      ref={cameraRef}
                      style={styles.camera}
                      type={RNCamera.Constants.Type.front}
                      flashMode={RNCamera.Constants.FlashMode.off}
                      faceDetectionLandmarks={
                          RNCamera.Constants.FaceDetection.Landmarks
                            ? RNCamera.Constants.FaceDetection.Landmarks.all
                            : undefined
                        }
                      faceDetectionClassifications={
                          RNCamera.Constants.FaceDetection.Classifications
                              ? RNCamera.Constants.FaceDetection.Classifications.all
                              : undefined
                          }
                        onFacesDetected={() => {
                          if (!loader) {
                            takePicture(cameraRef.current);
                          }
                        }}
                        onFaceDetectionError={(err) => { console.log('onFaceDetectionError :', err); }}
                        androidCameraPermissionOptions={{
                          title: 'Permission to use camera',
                          message: 'We need your permission to use your camera',
                          buttonPositive: 'Ok',
                          buttonNegative: 'Cancel',
                        }}
                        ratio="4:3"
                        androidRecordAudioPermissionOptions={{
                          title: 'Permission to use audio recording',
                          message: 'We need your permission to use your audio',
                          buttonPositive: 'Ok',
                          buttonNegative: 'Cancel',
                        }}>
                       <BarcodeMask 
                          width={'90%'} 
                          height={'90%'}
                          edgeHeight={75}
                          edgeWidth={75}
                          edgeBorderWidth={10} 
                          edgeRadius={20}
                          edgeColor='#58a279'
                          animatedLineColor='#58a279' 
                          animatedLineHeight={5} 
                          outerMaskOpacity={0}
                        />
                    </RNCamera>
                  </View>
                ) :
                (
                  <View style={styles.cameraContainer}>
                    <SVGBg height={250} width={250}/>
                  </View>
                )
              }
              <View style={styles.statusContainer}>
                <Text style={styles.status}>{status}</Text>
              </View>
            </View>
            <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-between'}}>
              {
                renderCheckBox()
              }
            </View>
            <View style={{flex: 0.075, justifyContent: 'center'}}>
                <View style={styles.btnContainer}>
                  { renderEnrollBtn() }
                  { renderVerifyBtn() }
                </View>
              </View>
        </View>
      </>
    )
};

const styles = StyleSheet.create({
    cameraContainer: {
      flex: 1, 
      backgroundColor: 'silver', 
      justifyContent: 'center', 
      alignItems: 'center'
    },
    cover: {
      height: '75%',
      width: '75%',
    },
    camera: {
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    },
    statusContainer: {
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingTop: 10, 
      paddingBottom: 10
    },
    status: {
      color: 'red', 
      fontSize: 20, 
      fontWeight: 'bold'
    },
    btnContainer: {
      flexDirection: 'row',
    },
    enrollBtn: {
      marginStart: 20,
      marginEnd: 10,
      flex: 0.5,
      backgroundColor: '#30D5C8', 
      paddingStart: 20, 
      paddingEnd: 20, 
      padding: 10, 
      borderRadius: 5,
      alignItems: 'center'
    },
    enrollBtnText: {
      color: 'white', 
      fontWeight: 'bold'
    },
    verifyBtn: {
      marginStart: 10,
      marginEnd: 20,
      flex: 0.5,
      borderWidth: 1,
      borderColor: '#30D5C8', 
      paddingStart: 20, 
      paddingEnd: 20, 
      padding: 10, 
      borderRadius: 5,
      alignItems: 'center'
    },
    verifyBtnText: {
      color: '#30D5C8', 
      fontWeight: 'bold'
    },
    removeBtn: {
      marginStart: 20,
      marginEnd: 10,
      flex: 0.5,
      backgroundColor: '#30D5C8', 
      paddingStart: 20, 
      paddingEnd: 20, 
      padding: 10, 
      borderRadius: 5,
      alignItems: 'center'
    },
    removeBtnText: {
      color: 'white', 
      fontWeight: 'bold'
    },
    help: {
      height: 20,
      width: 20
    },
});

export default LivenessDetection;