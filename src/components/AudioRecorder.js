import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export default AudioRecorder = ({Path}) => {
  const [isAlreadyPlay, setisAlreadyPlay] = useState(false);
  const [inprogress, setInprogress] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const [timeElapsed, setTimeElapsed] = useState('00:00:00');
  const [percent, setPercent] = useState(0);
  const [time, setTime] = useState('00:00');
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());

  const onStartPress = async () => {
    setisAlreadyPlay(true);
    setInprogress(true);
    audioRecorderPlayer.startPlayer(Path);
    audioRecorderPlayer.setVolume(1.0);

    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer();
        setisAlreadyPlay(false)
      }
      let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).substring(0, audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).length - 3);
      let percent = Math.round((Math.floor(e.currentPosition) / Math.floor(e.duration)) * 100);
      setTimeElapsed(e.currentPosition);
      if(isNaN(percent)){
        console.log("your value is nan");
      } else {
        setPercent(percent)
      }
      if(time != '-1:-1'){
        setTime(time)
      }
      setDuration(e.duration);
    });
  };

  const onPausePress = async (e) => {
      audioRecorderPlayer.pausePlayer();
      setisAlreadyPlay(false);
  };

  const changeTime = async (seconds) => {
    if(Path){
      let seektime = (seconds / 100) * duration;
      setTimeElapsed(seektime);
      audioRecorderPlayer.seekToPlayer(seektime);
    }
  };

    return(
        <View style={{backgroundColor: '#58a279', margin: 20, borderRadius: 10}}>
           <Slider
            style={{width: null, height: 60}}
            minimumValue={0}
            maximumValue={100}
            value={percent}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="green"
            onValueChange={(seconds) => changeTime(seconds)}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{paddingStart: 20}}>
              <Text>              </Text>
            </View>
            <View style={{paddingBottom: 20}}>
              {!isAlreadyPlay ? (
                <TouchableOpacity onPress={()=>{
                  Path ? onStartPress() : null
                }}>
                  <Image style={{width: 35, height: 35}} source={require('../assets/album/audio_player/play.png')}/>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={()=>{
                  onPausePress()
                }}>
                  <Image style={{width: 35, height: 35}} source={require('../assets/album/audio_player/pause.png')}/>
                </TouchableOpacity>
              )}
            </View>
            <View style={{paddingEnd: 20}}>
              <Text style={{color: 'white'}}>{!inprogress ? duration : time}</Text>
            </View>
          </View>
        </View>
    )
};

const styles = StyleSheet.create({

});