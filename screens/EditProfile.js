import {View, Text, SafeAreaView, TouchableOpacity,ScrollView, TextInput, Image, StyleSheet, Platform,  Pressable, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable, connectStorageEmulator } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import { firebase } from '../firebase';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';


const EditProfile = ({ navigation, user }) => {
  const [nickName, setNickName] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); // 기본값을 true로 설정

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const updateUserProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('로그인된 사용자가 없습니다.');
        return;
      }

      if (!image) {
        console.log('이미지를 선택해주세요.');
        return;
      }

      if (!nickName) {
        Alert.alert('닉네임을 입력해주세요.');
        return;
      }

      if (!isNicknameAvailable) {
        // 닉네임이 중복된 경우 알림창을 표시하고 함수를 종료합니다.
        console.log('이미 존재하는 닉네임입니다.');
        Alert.alert('닉네임 중복', '이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요.');
        return;
      }

      const storage = getStorage();
      const imageRef = ref(storage, `user_profile/${currentUser.uid}.jpg`);

      // 이미지의 uri를 사용하여 Blob으로 변환
      const response = await fetch(image);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on('state_changed', null, null, async () => {
        const downloadURL = await getDownloadURL(imageRef);

        // 이미지 URL을 Firestore에 저장
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', currentUser.uid);

        // profilePicture 사진 업데이트
        await updateDoc(userRef, {
          profilePicture: downloadURL,
          nickName: nickName
        }, { merge: true });

        navigation.navigate('Profile');
      });
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
    }
  };

  // Firestore에서 사용자 데이터를 실시간으로 감시하여 닉네임과 프로필 사진 설정
  useEffect(() => {
    const firestore = getFirestore();
    const userRef = doc(firestore, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        // 닉네임이 존재하면 해당 닉네임을 상태 변수에 설정
        if (userData.nickName) {
          setNickName(userData.nickName);
        }
        // profilePicture가 존재하면 해당 URL을 상태 변수에 설정
        if (userData.profilePicture) {
          setImage(userData.profilePicture);
        }
        // 다른 필요한 사용자 데이터도 처리할 수 있습니다.
      } else {
        console.log('해당 사용자를 찾을 수 없습니다.');
      }
    });

    // 컴포넌트가 언마운트될 때 감시를 해제합니다.
    return () => unsubscribe();
  }, [user]);

  // 닉네임 중복 여부를 확인하는 함수
  const checkNicknameAvailability = async () => {
    if (!nickName) {
      setIsNicknameAvailable(true); // Set as available if nickname is empty
      return;
    }

    try {
      const firestore = getFirestore();
      const usersRef = collection(firestore, 'users');

      // 사용자 컬렉션에서 해당 닉네임을 가진 사용자가 있는지 조회합니다.
      const q = query(usersRef, where('nickName', '==', nickName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 닉네임이 이미 존재하는 경우
        console.log('이미 존재하는 닉네임입니다.');
        setIsNicknameAvailable(false);
      } else {
        // 닉네임이 존재하지 않는 경우
        console.log('사용 가능한 닉네임입니다.');
        setIsNicknameAvailable(true);
        // 여기에서 닉네임을 변경하거나 저장 등의 로직을 추가할 수 있습니다.
      }
    } catch (error) {
      console.error('닉네임 확인 중 오류:', error);
    }
  };

  // 닉네임이 바뀔 때마다 checkNicknameAvailability 실행
  useEffect(() => {
    checkNicknameAvailability();
  }, [nickName]);

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
                                        onChangeText={(text) => setNickName(text)}
                                        defaultValue={nickName.toLowerCase()}
                                        value={nickName}
                                        placeholder='닉네임을 입력해주세요'
                                        editable={true}
                                        multiline={false}
                                        style={styles.inputText} />

                                    {/* 닉네임이 중복되었을 경우 뜨는 창 */}
                                    {!isNicknameAvailable && (
                                        <Text style={{ fontSize: 14, textAlign: 'center', color: '#1AAD55', marginTop: 7}}>
                                            * 이미 존재하는 닉네임입니다.
                                        </Text>
                                    )}

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>

            <Pressable style={styles.button} onPress={updateUserProfile}>
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
        fontSize: 18,
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
