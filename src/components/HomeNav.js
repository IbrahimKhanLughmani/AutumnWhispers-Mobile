import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {navigate} from '../navigationRef';
import BottomSheet from 'reanimated-bottom-sheet';
import Memory_Green from '../assets/home_screen/home_nav/memories.svg';
import Account_Grey from '../assets/home_screen/home_nav/account_grey.svg';
import SVGAlbum from '../assets/home_screen/add_btn/add_album.svg';
import SVGClose from '../assets/home_screen/add_btn/close.svg';
import SVGAdd from '../assets/home_screen/add_btn/add.svg';

export default HomeNav = ({SheetRef, navigationToCreateScreen}) => {
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
                            navigationToCreateScreen();
                        }}>
                        <SVGAlbum style={styles.icon}/>
                        <Text>Add album</Text>
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

    return(
       <>
         <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    //do nothing
                }}>
                <Memory_Green style={{height: 25, width: 25, marginBottom: 5}}/>
                <Text style={{color: '#58a279', fontWeight: 'bold'}}>Memories</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    sheetRef.current.snapTo(1)
                }}>
                <SVGAdd style={{height: 50, width: 50}}/>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    navigate('Account')
                }}>
                <Account_Grey style={{height: 25, width: 25, marginBottom: 5}}/>
                <Text style={{fontWeight: 'bold'}}>Account</Text>
            </TouchableOpacity>
            </View>
            <BottomSheet
                initialSnap={2}
                ref={sheetRef}
                snapPoints={[450, 300, 0]}
                borderRadius={30}
                renderContent={renderContent}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        height: 50, 
        width: 50, 
        margin: 10
    },
    iconContainer: {
        alignItems: 'center'
    }
});