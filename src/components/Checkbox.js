import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native'
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkbox = ({ selected, onPress, text = '', checkValue, changeCheckValue, security, setModal,  ...props}) => (
    <TouchableOpacity 
        activeOpacity={1}
        style={styles.checkBox} 
        onPress={onPress} 
        {...props}>
        <CheckBox
            checkBoxColor={'grey'}
            isChecked={checkValue}
            checkedCheckBoxColor={'green'}
            onClick={async()=>{
                changeCheckValue(!checkValue)
                if(checkValue === false){
                    security('1')
                  }
                  else{
                    security('0')
                  }
            }}
        />
        <Text style={styles.textStyle}> {text} </Text>
        <TouchableOpacity 
            style={styles.helpContainer}
            onPress={()=>{
                setModal(true)
            }}>
            <Image 
                style={styles.help} source={require('../assets/liveliness/help.png')}/> 
        </TouchableOpacity>         
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    checkBox: {
        flexDirection: 'row',
    },
    textStyle: {
        color: 'grey',
        paddingTop: 2
    },
    helpContainer: {
        alignItems: 'center',
        padding: 5,
        marginStart: 5
    },
    help: {
        height: 15,
        width: 15,
    }
})

export default Checkbox;