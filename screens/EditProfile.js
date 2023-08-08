import {View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet, Platform,  Pressable, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, doc,  getDocs, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';


const EditProfile = ({ navigation, user }) => {
  //닉네임
  const [nickName, setNickName] = useState('');
  //닉네임 사용 여부 - true: 사용가능 
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); 
  //이전 닉네임 저장
  const [prevNickName, setPrevNickName] = useState('');
 
  //프로필 이미지
  const [image, setImage] = useState(null);
  //프로필 이미지 변경 - true: 이미지 변경
  const [isImageChanged, setIsImageChanged] = useState(false);
  
  //닉네임관련 - 완료 버튼
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);


  console.log('user 정보', user)

  //닉네임 변경
  const changedNickName= (text) => {
    setNickName(text)
    // 닉네임이 변경되었으므로 isNicknameChanged를 true로 설정
    setIsNicknameChanged(true);

    //만약 변경한 닉네임이랑 이전 닉네임이 같을 시
    if (text == prevNickName) {
      setIsNicknameChanged(false);
    } else {
      setIsNicknameChanged(true);
    }
  }

  //image-picker 라이브러리
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //사용자가 이미지 선택 취소 하지 않을 시 실행
    if (!result.cancelled) {
      setImage(result.uri);
      //이미지 변경
      setIsImageChanged(true);
    }
  };

  //완료 버튼 누를 시 파이어베이스에 저장
  const updateUserProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      //닉네임이 없을 시
      if (!nickName) {
        Alert.alert('닉네임을 입력해주세요.');
        return;
      }

      //닉네임 변경시 
      if (nickName !== prevNickName) {
        //중복 여부 함수 실행
        const isNicknameAvailable = await checkNicknameAvailability();
        //닉네임 중복 시
        if (!isNicknameAvailable) {
          Alert.alert('이미 존재하는 닉네임입니다.');
          return;
        }
      }

      //닉네임 변경, 프로필 이미지 변경 X
      if (nickName === prevNickName && !isImageChanged) {
        //닉네임 사용 가능
        setIsNicknameAvailable(true);
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
        }, 
        { merge: true }
        );

        console.log('완료')


        await updateProfile(user, {
          photoURL: downloadURL,
          displayName: nickName,
        });

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
         // 이전 닉네임 설정
        setPrevNickName(userData.nickName || '');
        // 닉네임이 존재하면 해당 닉네임을 상태 변수에 설정
        if (userData.nickName) {
          setNickName(userData.nickName);
        }
        // profilePicture가 존재하면 해당 URL을 상태 변수에 설정
        if (userData.profilePicture) {
          setImage(userData.profilePicture);
        }
      } else {
        console.log('해당 사용자를 찾을 수 없습니다.');
      }
    });

    // 컴포넌트가 언마운트될 때 감시를 해제
    return () => unsubscribe();
  }, [user]);

  // 닉네임 중복 여부를 확인하는 함수
  const checkNicknameAvailability = async () => {
    //닉네임이 없을 때
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
                                        <Image 
                                          style={{backgroundColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center',
                                          width: 150, height: 150, borderRadius: 100}} 
                                          source={{ uri: image }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Ionic name="image" size={30} color='#B7B7B7' style={{top:-45, left:215}}/>
                                                            
                                {/* 닉네임 컨테이너 */}
                                <View style={{marginVertical: 8}}>
                                    <Text style={styles.subTitle}>닉네임</Text>
                                
                                    {/* 입력창 */}
                                    <TextInput
                                        onChangeText={changedNickName}
                                        defaultValue={nickName.toLowerCase()}
                                        value={nickName}
                                        placeholder='닉네임을 입력해주세요'
                                        editable={true}
                                        multiline={false}
                                        style={styles.inputText} />

                                    {!isNicknameAvailable && nickName !== prevNickName && (
                                      <Text style={{ fontSize: 14, textAlign: 'center', color: '#1AAD55', marginTop: 7 }}>
                                        * 이미 존재하는 닉네임입니다.
                                      </Text>)
                                    }

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>

            {/* 닉네임 변경 또는 이미지 변경 시 완료 버튼 활성화 */}
            {isNicknameChanged || isImageChanged ? (
              <Pressable style={[styles.button, { backgroundColor: '#0BE060' }]}
                  onPress={updateUserProfile}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                    완료
                  </Text>
              </Pressable>
            ) : (
              <View style={[ styles.button, { backgroundColor: '#CBCBCB' } ]}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                  완료
                </Text>
              </View>
            )}
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
