import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {navigate} from '../navigationRef';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import BottomSheet from 'reanimated-bottom-sheet';
import SVGSound from '../asset/icons/add_audio.svg';
import SVGCamera from '../asset/icons/add_photo.svg';
import SVGVideo from '../asset/icons/add_video.svg';
import SVGAdd from '../asset/icons/add.svg';

export default AlbumNav = ({SheetRef, album, info, setSounds, setPhotos, setVideos}) => {
    const sheetRef = SheetRef;

    const renderContent = () => (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 450,
            }}>
            <View style={{flex: 1}}>
                <View style={{flex: 0.2, alignItems: 'center'}}>
                    <Text style={{color: '#343c71', fontSize: 18, fontWeight: 'bold'}}>Add Media</Text>
                </View>
                <View style={{flex: 0.4, flexDirection: 'row'}}>
                    <View style={{flex: 1, backgroundColor: 'rgba(51, 60, 113, 0.1)', marginEnd: 2.5}}>
                        <TouchableOpacity 
                            style={styles.iconContainer}
                            onPress={()=>{
                                setSounds(true)
                                setPhotos(false)
                                setVideos(false)
                                navigate('AddAudio', {album: album})
                            }}>
                            <SVGSound height={50} width={50}/>
                            <Text style={styles.botText}>Audio</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, backgroundColor: 'rgba(51, 60, 113, 0.1)', marginStart: 2.5, marginEnd: 2.5}}>
                        <TouchableOpacity 
                            style={styles.iconContainer}
                            onPress={()=>{
                                setSounds(false)
                                setPhotos(true)
                                setVideos(false)
                                navigate('AddPhoto', {album: album})
                            }}>
                            <SVGCamera height={50} width={50}/>
                            <Text style={styles.botText}>Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, backgroundColor: 'rgba(51, 60, 113, 0.1)', marginStart: 2.5}}>
                        <TouchableOpacity 
                            style={styles.iconContainer}
                            onPress={()=>{
                                setSounds(false)
                                setPhotos(false)
                                setVideos(true)
                                navigate('AddVideo', {album: album})
                            }}>
                            <SVGVideo height={50} width={50}/>
                            <Text style={styles.botText}>Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderTabBar = () => {
        return (
          <View></View>
        );
    };

    const renderButton = () => {
        if(info != true){
            return(
                <>
                    <View style={{ flex: 1 }}>
                        <CurvedBottomBar.Navigator
                        type="up"
                        style={styles.bottomBar}
                        strokeWidth={0.5}
                        height={Platform.OS === 'android' ? 55 : 65}
                        circleWidth={55}
                        bgColor = 'rgba(255, 255, 255, 0.5)'
                        // borderTopLeftRight
                        // swipeEnabled
                        renderCircle={() => (
                            <Animated.View style={styles.btnCircleUp}>
                            <TouchableOpacity
                                style={{flex: 1, ustifyContent: 'center'}}
                                onPress={() => SheetRef.current.snapTo(1)}>
                                <SVGAdd height={50} width={50}/>
                            </TouchableOpacity>
                            </Animated.View>
                        )}
                        tabBar={renderTabBar}>
                        <CurvedBottomBar.Screen
                            name="title1"
                            position="left"
                            component={() => (
                                <View style={{ backgroundColor: '#BFEFFF', flex: 0 }} />
                            )}
                        />
                        <CurvedBottomBar.Screen
                            name="title2"
                            position="right"
                            component={() => (
                                <View style={{ backgroundColor: '#FFEBCD', flex: 0 }} />
                            )}
                        />
                        </CurvedBottomBar.Navigator>
                    </View>
                    <BottomSheet
                        initialSnap={2}
                        ref={SheetRef}
                        snapPoints={[450, 300, 0]}
                        borderRadius={30}
                        renderContent={renderContent}
                    />
                </>
            )
        }
    };

    return(
        <>
            { renderButton() }
            <BottomSheet
                initialSnap={2}
                ref={sheetRef}
                snapPoints={[450, 300, 0]}
                borderRadius={30}
                renderContent={renderContent}
            />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {},
    btnCircleUp: {
      width: 50,
      height: 50,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      bottom: 18,
      shadowColor: '#ffffff',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    //   elevation: 1,
    },
    imgCircle: {
      width: 30,
      height: 30,
      tintColor: 'gray',
    },
    botText: {
        color: '#343c71',
        marginTop: 10
    }
});