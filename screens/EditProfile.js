import {View, Text, SafeAreaView, TouchableOpacity,ScrollView, TextInput, Image, StyleSheet, Platform,  Pressable, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable, connectStorageEmulator } from 'firebase/storage';
import { storage } from '../firebase';
import { firebase } from '../firebase';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';


const EditProfile = ({navigation}) => {
    const [text, onChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');
    const [inputText, setinputText] = useState('');

    //사진 선택
    const [image, setImage] = useState(null);
    // console.log(image)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        setImage(result.uri);

        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };


    //파이어베이스 - storage 에 이미지 저장
    const uploadImageToFirebase = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (!user) {
          console.log('로그인된 사용자가 없습니다.');
          return;
        }
  
        if (!image) {
          console.log('이미지를 선택해주세요.');
          return;
        }
  
        const storage = getStorage();
        const imageRef = ref(storage, `user_profile/${user.uid}.jpg`);
  
        // 이미지의 uri를 사용하여 Blob으로 변환
        const response = await fetch(image);
        const blob = await response.blob();
  
        
        const uploadTask = uploadBytesResumable(imageRef, blob);

        uploadTask.on('state_changed', null, null, async () => {
            const downloadURL = await getDownloadURL(imageRef);
      
            // 이미지 URL을 Firestore에 저장
            const firestore = getFirestore();

            const userRef = doc(firestore, 'users', user.uid);
            
            //profilePicture 사진 업데이트
            await updateDoc(userRef, { profilePicture: downloadURL }, { merge: true });
          });
    
  
      } catch (error) {
        console.error('이미지 업로드 중 오류:', error);
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

            <Pressable style={styles.button} onPress={uploadImageToFirebase}>
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



    // const uploadImageToFirebase = async () => {
    //     try {
    //       const auth = getAuth();
    //       const user = auth.currentUser;
      
    //       if (!user) {
    //         console.log('로그인된 사용자가 없습니다.');
    //         return;
    //       }
      
    //       if (!image) {
    //         console.log('이미지를 선택해주세요.');
    //         return;
    //       }
      
    //       const storageRef = ref(getStorage(), `user_profile/${user.uid}.jpg`);
      
    //       // 이미지의 uri를 사용하여 Blob으로 변환
    //       const response = await fetch(image);
    //       const blob = await response.blob();
      
    //       const uploadTask = uploadBytesResumable(storageRef, blob);
      
    //       uploadTask.on('state_changed',
    //         (snapshot) => {
    //           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //           console.log('Upload is ' + progress + '% done');
    //           switch (snapshot.state) {
    //             case 'running':
    //               console.log('Upload is running');
    //               break;
    //             case 'paused':
    //               console.log('Upload is paused');
    //               break;
    //           }
    //         },
    //         (error) => {
    //           console.error('이미지 업로드 중 오류:', error);
    //         },
    //         () => {
    //           uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //             console.log('업로드한 이미지의 URL: ', downloadURL);
    //             // 이 URL을 Firestore에 저장하거나 필요에 따라 사용하세요.
    //           });
    //         }
    //       );
      
    //     } catch (error) {
    //       console.error('이미지 업로드 중 오류:', error);
    //     }
    //   };

    // const uploadImageToFirebase = async () => {
    //   try {
    //     const auth = getAuth();
    //     const user = auth.currentUser;
    
    //     if (!user) {
    //       console.log('로그인된 사용자가 없습니다.');
    //       return;
    //     }
    
    //     if (!image) {
    //       console.log('이미지를 선택해주세요.');
    //       return;
    //     }
    
    //     const storageRef = ref(getStorage(), `user_profile/${user.uid}.jpg`);
    
    //     // 이미지의 uri를 사용하여 Blob으로 변환
    //     const response = await fetch(image);
    //     const blob = await response.blob();
    
    //     const uploadTask = uploadBytesResumable(storageRef, blob);
    
    //     uploadTask.on('state_changed',
    //       (snapshot) => {
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload is ' + progress + '% done');
    //         switch (snapshot.state) {
    //           case 'running':
    //             console.log('Upload is running');
    //             break;
    //           case 'paused':
    //             console.log('Upload is paused');
    //             break;
    //         }
    //       },
    //       (error) => {
    //         console.error('이미지 업로드 중 오류:', error);
    //       },
    //       () => {
    //         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //           console.log('업로드한 이미지의 URL: ', downloadURL);
    //           // 이 URL을 Firestore에 저장하거나 필요에 따라 사용하세요.
    //         });
    //       }
    //     );
    
    //   } catch (error) {
    //     console.error('오류 발생:', error);
    //   }
    // };