import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default HomeHeader = ({MyMemories, setMyMemories, SharedMemories, setSharedMemories}) => {
    return(
        <View style={{flex: 1, flexDirection: 'row'}}>
            {
                MyMemories ? 
                <TouchableOpacity 
                    style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderColor: '#58a279'}}
                    onPress={()=>{
                        //do nothing
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#58a279'}}>My memories</Text>
                </TouchableOpacity> : 
                <TouchableOpacity 
                    style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderColor: 'grey'}}
                    onPress={()=>{
                        setMyMemories(true);
                        setSharedMemories(false);
                    }}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>My memories</Text>
                </TouchableOpacity>
            }
            {
                SharedMemories ? 
                <TouchableOpacity 
                    style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderColor: '#58a279'}}
                    onPress={()=>{
                        //do nothing
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#58a279'}}>Shared memories</Text>
                </TouchableOpacity> : 
                <TouchableOpacity 
                    style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderColor: 'grey'}}
                    onPress={()=>{
                        setMyMemories(false);
                        setSharedMemories(true);
                    }}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>Shared memories</Text>
                </TouchableOpacity>
            }
        </View>
    )
}