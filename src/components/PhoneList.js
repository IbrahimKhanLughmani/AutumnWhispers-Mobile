import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default PhoneList = ({style, contact, setContact}) => {

  useEffect( async () => {
    
    // setC_Code(await AsyncStorage.getItem('C_Code'))
    // setContact(await AsyncStorage.getItem('Contact'))
    
    // console.log(c_code)
    console.log(contact)
  }, [contact]);

    return(
        <View>
            {
                style ?
                <PhoneInput
                  value={contact}
                  defaultCode="PK"
                  layout="first"
                  containerStyle={styles.phoneContainer}
                  textContainerStyle={styles.textInputPhone}
                  onChangeFormattedText={text => {
                  setContact(text);
                  }}
                /> :
                <PhoneInput
                  value={contact}
                  defaultCode="PK"
                  layout="first"
                  containerStyle={stylesEdit.phoneContainer}
                  textContainerStyle={stylesEdit.textInputPhone}
                  // onChangeFormattedText={text => {
                  //   setContact(text);
                  // }}
                />
            }
        </View>
    )

};

const styles = StyleSheet.create({
    phoneContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#efefef',
        borderBottomWidth: 1,
        borderColor: 'silver'
      },
      textInputPhone: {
        paddingVertical: 0,
        backgroundColor: '#efefef',
        color: 'black'
      },
});

const stylesEdit = StyleSheet.create({
    phoneContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#efefef',
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 5
      },
      textInputPhone: {
        paddingVertical: 0,
        backgroundColor: '#efefef',
        color: 'black'
      },
});