import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, ImageBackground, SafeAreaView} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheetCamera from '../../components/BottomSheetCamera';
import { Context } from '../../context/AlbumContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';
import Spinner from 'react-native-loading-spinner-overlay';
import SVGBack from '../../asset/icons/back.svg';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';

const EditAlbumScreen = ({navigation}) => {
    const {editAlbum, uploadFile} = useContext(Context);
    const sheetRefCamera = useRef(null);
    const album = navigation.getParam('album');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [checkValue, setCheckValue] = useState(false);
    const [albumSecurity, setAlbumSecurity] = useState('0');
    const [loading, setLoading] = useState(false);
    const descriptionRef = useRef();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        setName(album.name)
        setDescription(album.description)
        setImage(album.cover_path)
        setAlbumSecurity(await AsyncStorage.getItem('Album_Security'))
        if(album.liveliness_detection === 0){
            setCheckValue(false)
        } else{
            setCheckValue(true)
        }
    };

    const renderHeader = () => {
        return(
            <View style={styles.headerInfoContainer}>
                <TouchableOpacity 
                  style={{flex: 0.2, padding: 10}}
                  onPress={()=>{
                    navigation.pop()
                  }}>
                    <SVGBack height={18} width={18}/>
                </TouchableOpacity>
                <View style={{flex: 0.7}}>
                  <Text style={styles.headerText}>Edit album</Text>
                </View>
                <View style={{flex: 0.3}}>
                  <TouchableOpacity 
                    style={{padding: 10, backgroundColor: '#58a279', borderRadius: 10}}
                    onPress={()=>{
                      submitRequest()
                    }}>
                      <Text style={{alignSelf: 'center', justifyContent: 'center', color: 'white'}}>Update</Text>
                  </TouchableOpacity>
                </View>
            </View>
        )
    };

    const renderContentCamera = () => (
        <BottomSheetCamera 
            sheetRefCamera={sheetRefCamera}
            setOpaque={''}
            image={image}
            setImage={setImage}
        />
    );

    const renderCheckBox = () => {
      return(
        <TouchableOpacity
          activeOpacity={1}
          style={{flexDirection: 'row', marginBottom: 20, justifyContent: 'center'}}
          onPress={()=>{
            if(albumSecurity === '0'){
              Toast.show('Please enable album security in Liveness Detection first', Toast.LONG)
            }
            else{
              setCheckValue(!checkValue)
            }
          }}>
          <Text style={albumSecurity === '0' ? styles.inputTitleDisable : styles.inputTitle}>Album security</Text>
          <CheckBox
            style={styles.checkbox}
            checkBoxColor={albumSecurity === '0' ? 'silver' : 'grey'}
            isChecked={checkValue}
            checkedCheckBoxColor={'green'}
            onClick={async()=>{
              if(albumSecurity === '0'){
                Toast.show('Please enable album security in Liveness Detection', Toast.LONG)
              }
              else{
                setCheckValue(!checkValue)
              }
            }}
          />
        </TouchableOpacity>
      )
    };

    const submitRequest = async () => {
      if(name === ''){
        Toast.show('Album name cant be empty', Toast.LONG)
      }
      else{
        setLoading(true)
        await editAlbum(album.fe_album_id, name, description, checkValue === true ? 1 : 0, setLoading) 
        await uploadFile(image, album.fe_album_id, 'album_cover', setLoading, ()=>navigation.dispatch(resetAction), name, description, checkValue === true ? 1 : 0) 
      }
    };
    
    return(
        <>
          <Spinner visible={loading}/>
          <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 0.1}}>
                { renderHeader() }
              </View>
              <View style={{flex: 0.9, marginTop: 20}}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    value={name}
                    style={styles.textInput} 
                    placeholder='Name' 
                    placeholderTextColor='grey'
                    onChangeText={(newText)=>{setName(newText)}}
                  />
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.descriptionContainer} onPress={()=>{descriptionRef.current.focus()}}>
                  <ScrollView>
                    <TextInput
                      ref={descriptionRef}
                      value={description}
                      style={styles.description} 
                      placeholder='Short description about this album...' 
                      multiline
                      placeholderTextColor='grey'
                      onChangeText={(newText)=>{setDescription(newText)}}
                    />
                  </ScrollView>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.imgContainer}
                  onPress={() => {
                    // chooseImage()
                    sheetRefCamera.current.snapTo(0)
                  }}>
                    {
                      image ? 
                      <Image 
                        style={{flex: 1, marginTop: 20, marginBottom: 20, borderRadius: 5}}
                        resizeMode='contain' 
                        source={{uri: image}}
                      /> : 
                      <Image 
                        style={styles.img}
                        resizeMode='contain' 
                        source={require('../../assets/album/album.png')}
                      />
                    }
                </TouchableOpacity>
                { renderCheckBox() }
              </View>
            </SafeAreaView>
          </View>
          <BottomSheet
            ref={sheetRefCamera}
            initialSnap={2}
            snapPoints={[125, 125, 0]}
            borderRadius={10}
            renderContent={renderContentCamera}
          />
        </>
    )
};

const styles = StyleSheet.create({
    headerInfoContainer: {
      flex: 1, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginStart: 10, 
      marginEnd: 10
    },
    headerText: {
      textAlign: 'center', 
      color: 'black', 
      fontSize: 20, 
      fontWeight: 'bold',
      paddingEnd: 5,
    },
    textInputContainer: {
      marginStart: 20,
      marginEnd: 20,
    },
    textInput: {
      borderWidth: 0.5,
      borderColor: 'silver',
      paddingStart: 15,
      paddingEnd: 15,
      height: 40,
      borderRadius: 5,
      color: 'black',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    imgContainer: {
      borderWidth: 0.5,
      borderColor: 'silver',
      flex: 0.9,
      marginTop: 10,
      marginStart: 20,
      marginBottom: 10,
      marginEnd: 20,
      borderRadius: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    descriptionContainer: {
      borderWidth: 0.5,
      borderColor: 'silver',
      height: 100, 
      marginStart: 20,
      marginEnd: 20, 
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
      borderRadius: 5
    },
    description: {
      flex: 1, 
      paddingStart: 15, 
      paddingEnd: 15,
      color: 'black',
    },
    date: {
      padding: 15,
      color: '#58a279',
      fontWeight: 'bold',
    },
    inputTitle: {
      marginStart: 10,
      marginEnd: 10,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: '#58a279'
    },
    inputTitleDisable: {
      marginStart: 10,
      marginEnd: 10,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: 'silver'
    },
    signupButton: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 20,
      height: 45,
      backgroundColor: '#58a279',
      borderRadius: 10,
    },
    signupText: {
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
    img: {
      flex: 1, 
      alignSelf: 'center',
      height: 450,
      width: 350,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 5
    },
    coverContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    cover: {
      height: 50,
      width: 50
    },
    checkbox: {
      height: 25,
      width: 25,
    },
});

export default EditAlbumScreen;