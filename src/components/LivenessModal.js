import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

export default LivenessModal = ({modal, setModal}) => {
    return(
        <Modal isVisible={modal}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleTitle}>App Security</Text>
            <Text style={styles.toggleText}>This feature will allow user to verify each time once user opens the application</Text>
            <Text></Text>
            <Text style={styles.toggleTitle}>Album Security</Text>
            <Text style={styles.toggleText}>This feature will allow user to add security feature inside each album. Once album with security feature enabled is shared with users, they won't be able to open it without liveness verification</Text>
            <View style={styles.btnContainerModal}>
              <TouchableOpacity
                style={styles.okBtn}
                onPress={()=>{
                  setModal(!modal);
                }}>
                  <Text style={styles.okBtnText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )
};


const styles = StyleSheet.create({
    toggleContainer: {
        backgroundColor: 'white',
        paddingStart: 20,
        paddingEnd: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 10
      },
      toggleTitle: {
        fontWeight: 'bold',
      },
      btnContainerModal: {
        alignSelf: 'center',
      },
      okBtn: {
        padding: 10
      },
      okBtnText: {
        fontWeight: 'bold',
        color: '#58a279'
      }
});