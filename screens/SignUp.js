import { View, Text, TouchableOpacity, TextInput, StyleSheet,Platform, TouchableWithoutFeedback, Keyboard, 
ScrollView, Pressable} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase';

        

const SignUp = ({navigation, user}) => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nickName, setNickName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);


  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [emailExists, setEmailExists] = useState(false);
  const [nicknameExists, setNicknameExists] = useState(false);


  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  // 중복 확인 버튼을 눌렀을 때, 해당 이메일과 닉네임이 사용 가능한지를 나타내는 상태값
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);


  const auth = getAuth();



  const handlePasswordChange = (text) => {
    setPassword(text);
    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    setPasswordMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    // 비밀번호와 비밀번호 확인이 일치하는지 검사
    setPasswordMatch(password === text);
  };

  // 휴대폰 번호 유효성 검사
  const phoneValid = (phone) => {
    const phoneRegex = /^01[0-9]{8,9}$/;
    return phoneRegex.test(phone);
  };
  
  const handlePhoneChange = (text) => {
    setPhone(text);
    setIsValidPhone(phoneValid(text));
  };

  // 이메일 유효성 검사
  const emailValid = (email) => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailFormat.test(email);
  };

  // 이메일 중복 체크
  const handleCheckEmail = async () => {
    try {
      if (!emailValid(email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
      }

      setIsCheckingEmail(true);

      // 파이어베이스 - 파이어스토어 users 가져오기
      const q = query(collection(firestore, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      // 이메일 존재 확인
      setEmailExists(!querySnapshot.empty);
      // 이메일 중복 알림
      alertEmailDuplicate(querySnapshot.empty);
      //이메일 중복버튼 클릭 확인
      setIsEmailAvailable(querySnapshot.empty)
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };


  // 닉네임 중복 체크
  const handleCheckNickname = async () => {
    try {
        //닉네임 길이가 1이상일때만 
        if (nickName.length >= 1) {
          setIsCheckingNickname(true);
          const q = query(collection(firestore, 'users'), where('nickName', '==', nickName));
          const querySnapshot = await getDocs(q);
          //닉네임 존재 확인
          setNicknameExists(!querySnapshot.empty);
          //닉네임 중복 알림
          alertNicknameDuplicate(querySnapshot.empty);
          //닉네임 중복버튼 클릭 확인
          setIsNicknameAvailable(querySnapshot.empty)
        } else {
          alert('닉네임을 입력해주세요.');
        }
    } catch (error) {
        console.error('Error checking nickname:', error);
    } finally {
        setIsCheckingNickname(false);
    }
  };

  //이메일 사용가능 알림창
  const alertEmailDuplicate = (isEmpty) => {
    if (isEmpty) {
      alert('사용 가능한 이메일입니다.');
    } else {
      alert('이미 사용 중인 이메일입니다.');
    }
  };

  //닉네임 사용가능 알림창
  const alertNicknameDuplicate = (isEmpty) => {
    if (isEmpty) {
      alert('사용 가능한 닉네임입니다.');
    } else {
      alert('이미 사용 중인 닉네임입니다.');
    }
  };

  // 회원가입 파이어베이스
  const handleSignUp = async() => {
    try {

      if (!email || !password || !confirmPassword || !name || !phone || !nickName) {
        alert("모든 필수 항목을 입력해주세요.");
        return;
      }

      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (!isValidPhone) {
        alert('유효하지 않은 전화번호 형식입니다.');
        return;
      }

      if (!isValidEmail) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
      }

      //이메일, 닉네임 중복버튼 클릭 시 회원가입 가능
      if (isEmailAvailable && isNicknameAvailable) {
        // 파이어베이스 - 파이어스토어 users에 회원정보 저장
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // userCredential에서 user 객체를 가져오기
        const user = userCredential.user; 

        // user 객체가 존재하고 uid가 있는지 확인
        if (user && user.uid) {

          //파이어베이스 문서이름을 user.uid로 하기
          const userRef = doc(firestore, 'users', user.uid);

          const userData = {
            email,
            uid: user.uid,
            name,
            phone,
            nickName,
            profilePicture: null,
          };

          // 문서 ID를 user.uid로 설정하여 데이터를 Firestore에 저장

          await setDoc(userRef, userData);      

          await updateProfile(user, {
            displayName: nickName,
          });


        }

        alert("회원가입이 완료되었습니다!");

      } else {
          alert('이메일과 닉네임 중복 확인을 해주세요.');
      }
 
    } catch (error){
        console.log(error.message);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
          <SafeAreaView>

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
                      <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
                  </TouchableOpacity>
              </View>


              <View style={{backgroundColor:'#FBFBFB', paddingHorizontal: 18}}>
                  <KeyboardAwareScrollView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                      <View>
                        <Text style={{fontSize: 18, color: '#48566A', marginVertical: 12, fontWeight: 600}}>회원가입</Text>
                        
                        {/* 구분선 */}
                        <View style={styles.line}></View>
                        
                        <View>
                            <Text style={styles.title}>* 이메일</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            
                              <TextInput 
                                placeholder='이메일을 입력해주세요' 
                                value={email}
                                onChangeText={text => setEmail(text)}
                                autoCapitalize = 'none'
                                style={[styles.inputContainer, styles.small]}
                              />
                              
                            
                              {!isEmailAvailable ? (
                                <Pressable style={styles.btn} onPress={handleCheckEmail} disabled={isCheckingEmail}>
                                    <Text style={{fontSize: 14, color: '#1AAD55'}}>
                                      중복확인
                                    </Text>
                                </Pressable>
                              ) : (
                                <Pressable style={styles.checkedBtn} onPress={handleCheckEmail} disabled={isCheckingEmail}>
                                    <Text style={{fontSize: 14, color: '#A09E9E'}}>
                                      중복확인
                                    </Text>
                                </Pressable>
                              )}
                        
                            </View>

                            {!emailValid(email) ? (
                              <Text style={styles.matchText}>올바른 이메일 형식이 아닙니다.</Text>
                            ) : (
                              <Text style={styles.matchText}></Text>
                            )}

                        </View>

                        <View>

                          <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <Text style={styles.title}>* 비밀번호</Text>
                            <Text style={{fontSize: 12, color: '#A09E9E', marginLeft: 10}}>(6자리 이상)</Text>
                          </View>

                          <TextInput 
                            placeholder='비밀번호를 입력해주세요' 
                            value={password}
                            onChangeText={handlePasswordChange}
                            autoCapitalize = 'none'
                            style={[styles.inputContainer, styles.inputMargin]}
                            />


                          <View>
                            <TextInput 
                              placeholder='비밀번호를 다시 입력해주세요' 
                              value={confirmPassword}
                              onChangeText={handleConfirmPasswordChange}
                              autoCapitalize = 'none'
                              style={styles.inputContainer}
                            />

                            {!passwordMatch ? (
                              <Text style={styles.matchText}>비밀번호가 일치하지 않습니다.</Text>
                            ) : (
                              <Text style={styles.matchText}></Text>
                            )}

                          </View>

                        </View>
            
                        <View>
                          <Text style={styles.title}>* 이름</Text>
                          <TextInput 
                            placeholder='이름을 입력해주세요' 
                            value={name}
                            onChangeText={text => setName(text)}
                            autoCapitalize = 'none'
                            style={[styles.inputContainer, styles.inputMargin]}/>
                        </View>
            
                        <View>
                          <Text style={styles.title}>* 휴대폰 번호</Text>
                          <TextInput 
                            placeholder='휴대폰 번호를 입력해주세요  (숫자만 입력)' 
                            value={phone}
                            onChangeText={handlePhoneChange}
                            style={[styles.inputContainer, styles.inputMargin]}/>
                        </View>
                
                        <View>
                          <Text style={styles.title}>* 닉네임</Text>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TextInput 
                              placeholder='닉네임을 입력해주세요' 
                              value={nickName}
                              onChangeText={text => setNickName(text)}
                              autoCapitalize = 'none'
                              style={[styles.inputContainer, styles.small]}/>

                            {!isNicknameAvailable ? (
                              <Pressable style={styles.btn} onPress={handleCheckNickname} disabled={isCheckingNickname}>
                                  <Text style={{fontSize: 14, color: '#1AAD55'}}>
                                    중복확인
                                  </Text>
                              </Pressable>
                            ) : (
                              <Pressable style={styles.checkedBtn}  >
                                  <Text style={{fontSize: 14, color: '#A09E9E'}}>
                                    중복확인
                                  </Text>
                              </Pressable>
                            )}
    
                          </View>
                        </View>

                        <View style={{backgroundColor: '#FBFBFB', height: 60}} />
                        
                      </View>
                    </TouchableWithoutFeedback>
                  </KeyboardAwareScrollView>
              </View>
          </SafeAreaView>

          <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10}}>가입하기</Text>
          </Pressable>
      </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 47,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
  },
  inputMargin : {
    marginBottom: 22,
  },

  small: {
    width: '65%',
  },
  title: {
    fontSize: 14,
    color: '#424242',
    marginVertical: 7,
  },
  btn: {
    width: 100,
    height:47,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#1AAD55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBtn : {
    width: 100,
    height:47,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#B7B7B7',
    backgroundColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
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
  agreeContainer: {
    backgroundColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    height: 47,
  },
  line: {
    borderBottomColor: '#CBCBCB',
    marginBottom: 10,
    borderBottomWidth: 0.8
  },
  matchText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 8,
  },
  repeatPasswordInput: {
    backgroundColor: 'white',
    width: '100%',
    height: 47,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
  }
})


export default SignUp;