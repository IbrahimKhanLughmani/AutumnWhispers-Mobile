import React, {useContext, useEffect, useState} from 'react';
import {Text, StyleSheet, ImageBackground, View} from 'react-native';
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from 'react-native-confirmation-code-field';
import { Context } from '../../context/AuthContext';

const CELL_COUNT = 4;

const ResetPassVerification = ({navigation}) => {
    const email = navigation.getParam('email')
    const {state, resetPassVer} = useContext(Context);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect( async () => {
      if(state.errorMessage === 'Invalid Code'){
        setValue('')
      }  
    }, [state]);

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Please add reset code sent to your email</Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
        onEndEditing={()=>{
          resetPassVer(email, value.toString(), ()=>navigation.navigate('ResetPass'))
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        margin: 40,
        textAlign: 'center',
    },
    codeFieldRoot: {
        marginTop: 60,
        marginStart: 60, 
        marginEnd: 60,
    },
    cell: {
      width: 40,
      height: 40,
      fontSize: 24,
      borderWidth: 2,
      borderColor: 'black',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
  });

export default ResetPassVerification;