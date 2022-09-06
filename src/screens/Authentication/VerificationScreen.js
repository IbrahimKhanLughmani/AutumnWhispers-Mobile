import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text, StyleSheet, ImageBackground, View} from 'react-native';
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from 'react-native-confirmation-code-field';
import { Context } from '../../context/AuthContext';
import { StackActions, NavigationActions } from 'react-navigation';

const CELL_COUNT = 4;

const VerificationScreen = ({navigation}) => {
  const {removeErrorMessage} = useContext(Context)
  const email = navigation.getParam('email');
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Video' })],
    });
    const {state, verify} = useContext(Context);
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
    <View style={{flex: 1, marginTop: 40}}>
      <Text style={styles.title}>Verification code has been sent to your email</Text>
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
          verify(email, value.toString(), ()=>navigation.dispatch(resetAction))
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#58a279',
        marginTop: 40,
        textAlign: 'center',
        marginStart: 40, 
        marginEnd: 40,
        marginBottom: 40
    },
    codeFieldRoot: {
        marginTop: 20,
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
    signupButton:{
        marginRight:20,
        marginLeft:20,
        marginBottom: 10,
        marginTop:20,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#58a279',
        borderRadius:10,
        borderColor: '#58a279',
    },
    signupText:{
        color:'white',
        textAlign:'center',
        fontWeight: 'bold',
    },
});

export default VerificationScreen;