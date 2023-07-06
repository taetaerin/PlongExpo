import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';

const CustomerInput = ({name, placeholder, value, setValue, secureTextEntry}) => {
  return (
    <View style={[styles.inputContainer]}>
        <View style={styles.inputContent}>
            <Ionic style={styles.inputIcon} name={name} />
            <TextInput
              value={value}
              onChangeText={setValue}
              style={styles.inputText}
              placeholder={placeholder} 
              secureTextEntry={secureTextEntry}
              autoCapitalize = 'none'
            />
        </View>
    </View> 
  );
};

export default CustomerInput;

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 47,
        marginBottom: 6,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 16,
    },
  
      inputContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
  
      inputIcon: {
        fontSize: 16, 
        color: '#828282', 
        marginRight: 16,
      },
  
      inputText: {
        fontSize: 14,
        width: '70%',
      },
});