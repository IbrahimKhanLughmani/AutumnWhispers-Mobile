import React, {useState} from 'react';
import { View, Platform, Image, Text, Dimensions } from "react-native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import SVGPlay from '../../assets/album/audio_player/record.svg';
import SVGPause from '../../assets/album/audio_player/Started.svg';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(1);
const screenWidth = Dimensions.get('window').width;

const AddAudioScreen = ({navigation}) => {
  const album = navigation.getParam('album')
  const sound = navigation.getParam('sound')
  const [state, setState] = useState({
      recordSecs: 0,
      recordTime: '00:00',
      currentPositionSec: null,
      currentDurationSec: null,
      playTime: null,
      duration: null,
      recordingStart: false
  })

    const getFileObjForIOS = async (path) => {
      audioRecorderPlayer.startPlayer(path);
          audioRecorderPlayer.setVolume(1.0);
          audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
              audioRecorderPlayer.stopPlayer();
              audioRecorderPlayer.removeRecordBackListener();
                setState({
                  recordSecs: 0,
                  recordTime: '00:00',
                  recordingStart: false
                });
              } else{
                var time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).substring(0, audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).length - 3);
                if(time != '-1:-1'){
                  setState({
                    recordSecs: e.currentPosition,
                    recordTime: time,
                    recordingStart: true,
                  });
                }
              }
          });
    };

    const getFileObjForAndroid = async (path) => {
      await RNFetchBlob.fs.stat(path)
        .then((stats) => {
          audioRecorderPlayer.startPlayer(stats.path);
          audioRecorderPlayer.setVolume(1.0);
          audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
              audioRecorderPlayer.stopPlayer();
              audioRecorderPlayer.removeRecordBackListener();
                setState({
                  recordSecs: 0,
                  recordTime: '00:00',
                  recordingStart: false
                });
            } else{
                var time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).substring(0, audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).length - 3);
                if(time != '-1:-1'){
                  setState({
                    recordSecs: e.currentPosition,
                    recordTime: time,
                    recordingStart: true,
                  });
                }
              }
          });
        })
        .catch((err) => {
          console.log('uploadFiles -> err', err);
        });
    };

    const onPlayRecord = async () => {
      if(Platform.OS === 'android'){
        getFileObjForAndroid(sound.sound)
      }
      else{
        getFileObjForIOS(`file:///${sound.sound}`)
      }    
    };

    const onStartRecord = async () => {
      const dirs = RNFetchBlob.fs.dirs;
      const path = Platform.select({
        ios: `${uuid.v4()}.m4a`,
        android: `${dirs.CacheDir}/${uuid.v4()}.mp4`,
      });
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        var time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).substring(0, audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).length - 3);
        if(time != '-1:-1'){
          setState({
            recordSecs: e.currentPosition,
            recordTime: time,
            recordingStart: true,
          });
        }
        return;
      });
    };
      
    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setState({
          recordSecs: 0,
          recordTime: '00:00',
          recordingStart: false
        });
        if (result != 'Already stopped'){
            navigation.navigate('AddSound', {Path: result, Duration: state.recordTime, album: album});
        }
    };

    const checkPlay = () => {
      if(sound === undefined){
        onStartRecord()
      } else{
        onPlayRecord()
      }
    };

    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: 'black', marginBottom: 40}}>Tap to start recording</Text>
          {
            state.recordingStart ?
            <TouchableOpacity onPress={()=>{
              onStopRecord()
            }}>
              <SVGPause height={screenWidth/3} width={screenWidth/3}/>                  
            </TouchableOpacity> :
            <TouchableOpacity onPress={()=>{

              checkPlay()
            }}>
              <SVGPlay height={screenWidth/3} width={screenWidth/3}/>                  
            </TouchableOpacity>              
          }
          <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold', marginTop: 40}}>{state.recordTime}</Text>
        </View>
    )
};

export default AddAudioScreen;