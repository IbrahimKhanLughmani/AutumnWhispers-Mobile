import React, {useState} from 'react';
import { View, Platform, Image, Text, Dimensions, SafeAreaView } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import SVGEdit from '../../asset/icons/edit.svg';
import SVGBack from '../../asset/icons/back.svg';
import FolderSchema from '../../schema/FolderSchema';
import AlbumSchema from '../../schema/AlbumSchema';
import SoundSchema from '../../schema/SoundSchema';
import PhotoSchema from '../../schema/PhotoSchema';
import VideoSchema from '../../schema/VideoSchema';
import Realm from 'realm';
import SVGPlay from '../../assets/album/audio_player/play.svg';
import SVGPause from '../../assets/album/audio_player/Started.svg';
import SVGRight from '../../assets/album/audio_player/right.svg';
import SVGLeft from '../../assets/album/audio_player/left.svg';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(1);
const screenWidth = Dimensions.get('window').width;

const PlayAudioScreen = ({navigation}) => {
  const Album = navigation.getParam('album')
  const Sound = navigation.getParam('sound')
  const [isAlreadyPlay, setisAlreadyPlay] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const [timeElapsed, setTimeElapsed] = useState('00:00:00');
  const [percent, setPercent] = useState(0);
  const [time, setTime] = useState('00:00');
  const [sound, setSound] = useState(Sound);
  const [album, setAlbum] = useState(Album);
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());

  const onStartPress = async () => {
    setisAlreadyPlay(true)
    if(Platform.OS === 'android'){
      await RNFetchBlob.fs.stat(sound.sound)
      .then((stats) => {
        audioRecorderPlayer.startPlayer(stats.path)
      })
    }
    else{
      audioRecorderPlayer.startPlayer(`file:///${sound.sound}`)
    }
    audioRecorderPlayer.setVolume(1.0);

    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        setisAlreadyPlay(false)
        audioRecorderPlayer.stopPlayer()
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
      audioRecorderPlayer.pausePlayer()
      setisAlreadyPlay(false);
  };

  const changeTime = async (seconds) => {
    if(sound){
      let seektime = (seconds / 100) * duration;
      setTimeElapsed(seektime);
      audioRecorderPlayer.seekToPlayer(seektime);
    }
  };

  const previousSound = (fe_sound_id) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    }).then(realm => {
        const albums = realm.objects('Album');
        albums.map((item) => {
            if(item.fe_album_id === album.fe_album_id){
              item.sounds.map((sound, index) => {
                if(sound.fe_sound_id === fe_sound_id){
                  if(item.sounds[index-1] != undefined){
                    setTime('00:00')
                    setPercent(0)
                    setTimeElapsed('00:00:00')
                    setisAlreadyPlay(false)
                    audioRecorderPlayer.stopPlayer()
                    setSound(item.sounds[index-1])
                  }
                }
              })
            }
        })
    });
  };

  const nextSound = (fe_sound_id) => {
    Realm.open({
      schema: [FolderSchema, AlbumSchema, SoundSchema, PhotoSchema, VideoSchema]
    }).then(realm => {
        const albums = realm.objects('Album');
        albums.map((item) => {
            if(item.fe_album_id === album.fe_album_id){
              item.sounds.map((sound, index) => {
                if(sound.fe_sound_id === fe_sound_id){
                  if(item.sounds[index+1] != undefined){
                    setTime('00:00')
                    setPercent(0)
                    setTimeElapsed('00:00:00')
                    setisAlreadyPlay(false)
                    audioRecorderPlayer.stopPlayer()
                    setSound(item.sounds[index+1])
                  }
                }
              })
            }
        })
    });
  };

  const renderHeader = () => {
    return(
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginStart: 10, marginEnd: 10}}>
            <TouchableOpacity 
                style={{padding: 10}}
                onPress={()=>{
                    audioRecorderPlayer.stopPlayer()
                    navigation.pop()
                }}>
                <SVGBack height={18} width={18}/>
            </TouchableOpacity>
        </View>
    )
  };

    return(
        <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 0.075}}>
                  { renderHeader() }
              </View>
              <View style={{flex: 0.725, justifyContent: 'center', alignItems: 'center'}}>
                  {sound.description ? <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold', marginBottom: 40, alignSelf: 'center'}}>{sound.description}</Text> : <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold', marginBottom: 40, alignSelf: 'center'}}>No Title</Text>}
                  <Image 
                    style={{height: screenWidth/2, width: screenWidth/2, borderRadius: 200}} 
                    source={sound === undefined || sound.cover_image=== ' ' ? require('../../assets/album/unnamed.jpeg') : {uri: sound.cover_image}} 
                  />
                    <Slider
                        style={{width: screenWidth, marginTop: 40}}
                        minimumValue={0}
                        maximumValue={100}
                        value={percent}
                        minimumTrackTintColor="#58a279"
                        maximumTrackTintColor="#e5fdf5"
                        tapToSeek
                        onSlidingComplete={(seconds)=>{
                          changeTime(seconds)
                        }}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginStart: 20, marginEnd: 20, marginTop: 5}}>
                      <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>{time}</Text>
                      <Text style={{color: 'black', fontWeight: 'bold'}}>{sound.duration}</Text>
                    </View>
              </View>
              <View style={{flex: 0.2}}>
                <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 30, margin: 20, backgroundColor: '#e5fdf5'}}>
                  <TouchableOpacity onPress={()=>{
                    previousSound(sound.fe_sound_id)
                  }}>
                    <SVGLeft width={50} height={50}/>
                  </TouchableOpacity>
                  {!isAlreadyPlay ? (
                      <TouchableOpacity onPress={()=>{
                        onStartPress()
                      }}>
                        <SVGPlay width={75} height={75}/>
                      </TouchableOpacity>
                  ) : (
                      <TouchableOpacity onPress={()=>{
                        onPausePress()
                      }}>
                        <SVGPause width={75} height={75}/>
                      </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={()=>{
                    nextSound(sound.fe_sound_id)
                  }}>
                    <SVGRight width={50} height={50}/>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
        </View>
    )
};

export default PlayAudioScreen;