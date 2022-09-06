import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {navigate} from '../navigationRef';
import Account_Green from '../assets/home_screen/home_nav/account.svg';
import Memory_Grey from '../assets/home_screen/home_nav/memories_grey.svg';

export default AccountNav = () => {
    return(
        <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    navigate('Home');
                }}>
                <Memory_Grey style={{height: 25, width: 25, marginBottom: 5}}/>
                <Text style={{fontWeight: 'bold'}}>Memories</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    //do nothing
                }}>
                <Image style={{height: 50, width: 50}}/>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={()=>{
                    //do nothing
                }}>
                <Account_Green style={{height: 25, width: 25, marginBottom: 5}}/>
                <Text style={{color: '#58a279', fontWeight: 'bold'}}>Account</Text>
            </TouchableOpacity>
        </View>
    )
}