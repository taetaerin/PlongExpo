import {View, Text, SafeAreaView, TouchableOpacity,ScrollView, TextInput, Image, StyleSheet, Platform,  Pressable, TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const EditProfile = ({navigation}) => {
    const [text, onChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');
    const [inputText, setinputText] = useState('');

    //사진 선택
    const [image, setImage] = useState(null);
   
    //저장 함수
    const onPressSaveEdit = () => {

    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };
                
    return (
        <View style={{flex: 1}}>

            <SafeAreaView style={styles.container}>

                {/* 상단바 */}
                <View 
                    style={{
                    width: '100%', 
                    backgroundColor: 'white', 
                    height: 44, 
                    paddingHorizontal: 18,
                    justifyContent:'center',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#EAEAEA',
                }}>
                        <TouchableOpacity>
                            <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()}/>
                        </TouchableOpacity>
                </View>
            
                <View style={{flex: 1, backgroundColor: '#FBFBFB', paddingHorizontal: 18}}>

                    <KeyboardAwareScrollView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View>
                                {/* 프로필 사진 */}
                                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 45}}>
                                        <TouchableOpacity onPress={pickImage}>
                                            <Image style={{backgroundColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center',
                                            width: 150, height: 150, borderRadius: 100}} source={{ uri: image }}/>
                                        </TouchableOpacity>
                                </View>
                                <Ionic name="image" size={30} color='#424242' style={{top:-45, left:228}}/>
                                                            
                                {/* 닉네임 컨테이너 */}
                                <View style={{marginVertical: 8}}>
                                    <Text style={styles.subTitle}>닉네임</Text>
                                
                                    {/* 입력창 */}
                                    <TextInput
                                        onChangeText={(text) => setinputText(text)}
                                        defaultValue={inputText}
                                        placeholder='홍길동'
                                        editable={true}
                                        multiline={false}
                                        style={styles.inputText} />

                                    {/* 닉네임이 중복되었을 경우 뜨는 창 */}
                                    <Text style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        color: '#1AAD55',
                                        marginTop: 7,
                                    }}>
                                    * 이미 존재하는 닉네임입니다.
                                    </Text>
                                </View>

                                {/* 한줄 목표 컨테이너 */}
                                <View>
                                    <Text style={styles.subTitle}>한줄 목표</Text>
                                    <TextInput
                                        placeholder='화이팅'
                                        onChangeText={(text) => setinputText(text)}
                                        defaultValue={inputText}
                                        editable={true}
                                        multiline={false}
                                        style={styles.inputText} />
                                
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>

            <Pressable style={styles.button} onPress={() => console.log('click')}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10}}>완료</Text>
            </Pressable>
            
        </View>
    )
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        backgroundColor: 'white'
    },
    EdProfileContainer: {
        backgroundColor: 'red',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    subTitle: {
        textAlign: 'center',
        padding: 16,
        fontSize: 16,
        color: '#635B5B'
    },
    inputText: {
        width: '100%',
        height: 47,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: 'white',
        borderColor: '#E2E2E2',
        borderRadius: 4,
        borderWidth: 1,
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#0BE060',
    },
    seperator: {
        marginHorizontal: 0,
        marginTop: 46,
        marginBottom: 47,
        borderBottomColor: '#CBCBCB',
        borderBottomWidth: 0.8,
    }
  }
)

export default EditProfile;


