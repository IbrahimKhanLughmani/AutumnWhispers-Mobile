import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import Calender from '../components/Calender';

export default BottomSheetRender = ({sheetRef, setOpaque, markDate, setMarkDate}) => {
    return(
        <View style={styles.bottomContainer}>
            <View style={{flex: 1}}>
                <View style={styles.subContainer1}>
                    <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity 
                            style={styles.bottomHeadingContainer}
                            onPress={()=>{
                                sheetRef.current.snapTo(2);
                                setOpaque(1);
                            }}>
                            <Image style={styles.cross} source={require('../assets/album/calender/close.png')}/>
                        </TouchableOpacity>
                        <View style={styles.bottomTitle}>
                            <Text style={{fontWeight: 'bold'}}>Select a share date</Text>
                        </View>
                        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                            <Text></Text>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Calender markDate={markDate} setMarkDate={setMarkDate}/>
                    </View>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    bottomContainer: {
        backgroundColor: '#dcdcdc', 
        height: 500
      },
      subContainer1: {
        flex: 0.85, 
        paddingStart: 20, 
        paddingEnd: 20, 
        paddingTop: 10
      },
      bottomHeadingContainer: {
        flex: 0.2, 
        alignItems: 'flex-start'
      },
      cross: {
        height: 15, 
        width: 15
      },
      bottomTitle: {
        flex: 0.6, 
        alignItems: 'center'
      }
})