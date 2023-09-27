import { View, Text,  StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import Logo from './components/Logo';
import CustomerInput from './components/CustomerInput';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';



const SignIn = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();

  const handleSignIn = async () => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Main')
        
    } catch (error){
        Alert.alert(
          "다시 입력해주세요",
          error.message,
          [{text: '닫기', onPress: () => console.log('닫기')}],
          {cancelable: true}
        )
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          
          {/* 로고 컴포넌트 */}
          <Logo />

          {/* 로그인 컴포넌트 */}
          <CustomerInput 
              value = {email}
              setValue = {setEmail}
              autoCapitalize = 'none'
              placeholder = '아이디' name = 'person-outline'
          />

          {/* 비밀번호 컴포넌트 */}
          <CustomerInput 
              value={password} 
              setValue={setPassword} 
              secureTextEntry={true}
              placeholder='비밀번호' name='ios-lock-closed-outline' 
          />

          {/* 로그인 버튼  */}
          {/* <Pressable onPress={() => navigation.navigate('Main')} style={styles.signInBtn}> */}
          <Pressable onPress={handleSignIn} style={styles.signInBtn}>
              <Text style={styles.btnText}>로그인</Text>
          </Pressable>

          {/* 아이디 비밀번호 회원가입  */}
          <View style={styles.findContent}>
              <Text style={styles.findText}>아이디찾기</Text>
              <View style={styles.line}></View>
              <Text style={styles.findText}>비밀번호 찾기</Text>
              <Text style={styles.line}></Text>
              <Text style={styles.findText} onPress={() => navigation.navigate('SignUp')}>회원가입</Text>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
)};
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FBFBFB',
    },

    inner: {
      padding: 24,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

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

    signInBtn: {
      backgroundColor: '#0BE060',
      alignItems: 'center',
      borderWidth: 0,
      marginTop: 10,
      width: '100%',
      height: 47,
      marginBottom: 6,
      justifyContent: 'center',
      border: 0,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      paddingHorizontal: 16,
    },

    btnText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },

    findContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
      backgroundColor: 'orange',
      padding: 1,
      width: '100%',
    },

  findContent : {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', 
      marginTop: 12,
  },

  findText: {
      color: '#424242',
      fontSize: 14,
      marginRight: 16,
      opacity: 0.75,
  },

  line: {
      backgroundColor: 'black',
      marginRight: 16,
      width: 1,
      height: 14,
      opacity: 0.3,
  },
  });

export default SignIn;