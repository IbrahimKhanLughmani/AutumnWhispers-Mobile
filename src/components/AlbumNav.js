import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {navigate} from '../navigationRef';
import BottomSheet from 'reanimated-bottom-sheet';
import SVGAdd from '../assets/home_screen/add_btn/add.svg';
import SVGClose from '../assets/home_screen/add_btn/close.svg';
import SVGSound from '../assets/home_screen/add_btn/sound.svg';
import SVGCamera from '../assets/home_screen/add_btn/camera.svg';
import SVGVideo from '../assets/home_screen/add_btn/video.svg';

export default AlbumNav = ({SheetRef, album, info, shared, setSounds, setPhotos, setVideos}) => {
    const sheetRef = SheetRef;

    const renderContent = () => (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 450,
            }}>
            <View style={{flex: 1}}>
                <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity 
                        style={styles.iconContainer}
                        onPress={()=>{
                            setSounds(true)
                            setPhotos(false)
                            setVideos(false)
                            navigate('AddAudio', {album: album})
                        }}>
                        <SVGSound style={styles.icon}/>
                        <Text>Add sound</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.iconContainer}
                        onPress={()=>{
                            setSounds(false)
                            setPhotos(true)
                            setVideos(false)
                            navigate('AddPhoto', {album: album})
                        }}>
                        <SVGCamera style={styles.icon}/>
                        <Text>Add photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.iconContainer}
                        onPress={()=>{
                            setSounds(false)
                            setPhotos(false)
                            setVideos(true)
                            navigate('AddVideo', {album: album})
                        }}>
                        <SVGVideo style={styles.icon}/>
                        <Text>Add video</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                        style={styles.iconContainer}
                        onPress={()=>{
                            sheetRef.current.snapTo(2)
                        }}>
                    <SVGClose style={styles.icon}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderButton = () => {
        if(info != true){
            return(
                <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={()=>{
                            SheetRef.current.snapTo(1)
                        }}>
                        <SVGAdd style={styles.icon}/>
                    </TouchableOpacity>     
                </View>
            )
        }
    };

    return(
       <>
            {
                shared === true ? renderButton() : null
            }
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
    icon: {
        height: 50, 
        width: 50, 
    },
    iconContainer: {
        alignItems: 'center'
    }
});