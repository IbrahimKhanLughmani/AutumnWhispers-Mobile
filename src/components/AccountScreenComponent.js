import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default AccountScreenComponent = ({name, SVG, callback}) => {
    return(
        <TouchableOpacity 
            style={{borderBottomWidth: 0.5, borderColor: 'silver', marginStart: 10, marginEnd: 10}}
            onPress={()=>{
                callback();
            }}>
            <View style={{flexDirection: 'row', marginStart: 10, marginEnd: 10, marginTop: 20, marginBottom: 20}}>
                <View style={{flex: 0.1}}>
                    <SVG width={20} height={20}/>               
                </View>
                <View style={{flex: 0.9}}>
                    <Text style={{color: 'black'}}>{name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}