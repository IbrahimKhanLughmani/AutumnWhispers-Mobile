import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import SVGAdd from '../asset/icons/add.svg';
import SVGAlbum from '../asset/icons/add_album_art.svg';
import BottomSheet from 'reanimated-bottom-sheet';

export default AppNav = ({SheetRef, navigationToCreateScreen}) => {

    const renderContent = () => (
        <View style={styles.botContainer}>
            <View style={{flex: 1}}>
                <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={styles.iconContainer}>
                        <SVGAlbum height={150} width={175}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.addContainer}
                    onPress={()=>{
                      // alert('hi')
                        navigationToCreateScreen();
                    }}>
                    <Text style={styles.addText}>Add album</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTabBar = () => {
      return (
        <View></View>
      );
    };

    return (
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
    );
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    button: {
      marginVertical: 5,
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
    img: {
      width: 30,
      height: 30,
    },
    iconContainer: {
      alignItems: 'center'
    },
    addContainer: {
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20,
      marginTop: 20,
      height: 45,
      backgroundColor: '#343c71',
      borderRadius: 10,
    },
    addText: {
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
    },
    botContainer: {
      backgroundColor: 'white',
      padding: 16,
      height: 450,
    }
});