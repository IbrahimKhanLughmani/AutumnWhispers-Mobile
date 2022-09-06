import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, Platform} from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask'
import axios from '../api/LivenessApisConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Toast from 'react-native-root-toast';
import SVGBg from '../assets/liveliness/verified.svg'

const VerificationScreen = ({navigation}) => {
  const root_nav = navigation.getParam('root_nav')
  const [loader, setLoader] = useState(false);
  const cameraRef = useRef();
  const [status, setStatus] = useState('');
  const [verifyBtn, setVerifyBtn] = useState(true);
  const [state, setState] = useState({
    isCamera: false,
    isEnrolled: false,
    isVerified: false,
    livenessData: '',
    type: '',
    picture: '',
  });
  const {isCamera, type} = state;
  const [biometric, setBiometric] = useState({biometryType: null})

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
    .then((biometryType) => {
      setBiometric({biometryType});
    })
    .catch((error) => {
      console.log('isSensorAvailable error => ', error)
    })
  });
  
  const getMessage = () => {
    if(biometric.biometryType === 'Face ID') {
      return 'Scan your Face on the device to continue'
    } else {
      return 'Scan your Fingerprint on the device scanner to continue'
    }
  };

  const showAuthenticationDialog = () => {
    if(biometric.biometryType !== null && biometric.biometryType !== undefined){
      FingerprintScanner.authenticate({
        description: getMessage()
      })
      .then(() => {
        if(root_nav === 'Login'){
          navigation.replace('Home')
        } 
        else{
          navigation.replace('Album', {
            item: root_nav
          })
        }
      })
      .catch((error) => {
        console.log('Authentication error is => ', error);
        FingerprintScanner.release();
      });
    }
    else{
      console.log('biometric authentication is not available');
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
        if(response.status != 'Verify OK'){
          if(response.status === 'Go Back'){
            Toast.show('Move away from camera', {duration: Toast.durations.SHORT, position: -100})
          }
          else if(response.status === 'Move Closer'){
            Toast.show('Come closer to camera', {duration: Toast.durations.SHORT, position: -100})
          }
          else{
            Toast.show(response.status, {duration: Toast.durations.SHORT, position: -100})
          }
        }
        if(type === 'verify' && (response?.status === 'Go Back' || response?.status === 'No Face Detected' || response.status === 'Move Closer')){
          setTimeout(() => {takePicture(cameraRef.current)}, 5000);
        }
        if(type === 'verify' && response.status === 'Verify Failed'){
          setState((p) => ({...p, isCamera: false, isEnrolled: true, picture: base64}))
          setVerifyBtn(true)
        }
        if(type === 'verify' && (response?.status === 'Verify OK')){
          setState((p) => ({...p, isCamera: false, isVerified: true, livenessData: response?.liveness, picture: base64}))
          setVerifyBtn(true)
          if(root_nav === 'Login'){
            navigation.replace('Home')
          } 
          else{
            navigation.replace('Album', {
              item: root_nav
            })
          }
        }
      }).catch((err) => {
        setLoader(false);
        setState((p) => ({ ...p, isCamera: false }));
        console.log('uploadProof -> err', err);
      });
  };

  const onClickVerify = () => {
    if(root_nav === 'Login'){
      if(Platform.OS === 'ios' && biometric.biometryType === 'Face ID'){
        showAuthenticationDialog()
      }
      else{
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            takePicture(cameraRef.current);
          }, 5000);
        }
        setState((p) => ({ ...p, isCamera: !isCamera, type: 'verify' }));
        setVerifyBtn(false)
      }
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
      setVerifyBtn(false)
    }
  };

  const renderVerifyBtn = () => {
    if(verifyBtn === true){
      return(
        <View style={{flex: 0.1}}>
          <TouchableOpacity 
            style={styles.verifyBtn} 
            onPress={()=>{
              onClickVerify()
            }}>
              <Text style={styles.verifyBtnText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.1, paddingStart: 10, paddingTop: 10, paddingEnd: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Liveness Check</Text>
          <View style={{borderWidth: 1, borderColor: '#58a279', borderRadius: 5, backgroundColor: '#c8e6c9', justifyContent: 'center'}}>
            <Text style={{paddingStart: 5, paddingEnd: 5, fontSize: 10, color: '#58a279'}}>Verified</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 0.8}}>
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
      {
        renderVerifyBtn()
      }
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: '70%',
    backgroundColor: 'green',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white', fontSize: 17, fontWeight: 'bold'
  },
  biometryText: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 30,
  },

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
    paddingBottom: 10,
  },
  status: {
    color: 'red', 
    fontSize: 20, 
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
});

export default VerificationScreen;