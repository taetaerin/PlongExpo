import { View, Text, TouchableOpacity, TextInput, StyleSheet,Platform, TouchableWithoutFeedback, Keyboard, 
ScrollView, Pressable} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
        
        
        const SignUp = ({navigation}) => {
          const [checked, setChecked] = useState(true);
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [name, setName] = useState('');
          const [phone, setPhone] = useState('');
          const [nickName, setNickName] = useState('');
          const auth = getAuth();

          const handleSignUp = async() => {
            try {
              const user = await createUserWithEmailAndPassword(auth, email, password);
              console.log('user', user)
            } catch (error){
                console.log(error.message);
            }
          }
        
          return (
            
            <View style={{flex: 1, backgroundColor: 'white'}}>
            <SafeAreaView>
                <View 
                    style={{
                    width: '100%', 
                    backgroundColor: 'white', 
                    height: 44, 
                    paddingHorizontal: 18,
                    justifyContent:'center'}}
                    >
                    <TouchableOpacity  onPress={() => navigation.goBack()}>
                        <Ionic name="chevron-back-sharp" style={{fontSize:24}} />
                    </TouchableOpacity>
                  </View>
        
        
              <KeyboardAwareScrollView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}
                contentInset={{ bottom: 60 }} style={{backgroundColor: '#FBFBFB'}}>
        
                  <View style={{flex: 1, paddingHorizontal: 18}}>
        
                    <Text style={{fontSize: 18, color: '#48566A', marginVertical: 11, fontWeight: 600}}>회원가입</Text>
        
                    <View>
                      <Text style={styles.title}>* 이메일</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TextInput 
                          placeholder='이메일을 입력해주세요' 
                          style={[styles.inputContainer, styles.small]}
                          value={email} 
                          onChangeText={text => setEmail(text)}
                          />

                        <Pressable style={styles.btn}>
                          <Text style={{fontSize: 14, color: '#1AAD55'}}>
                            중복확인
                          </Text>
                        </Pressable>

                      </View>
                    </View>
        
                    <View>
                      <Text style={styles.title}>* 비밀번호</Text>
                      <TextInput 
                        placeholder='비밀번호를 입력해주세요' 
                        style={styles.inputContainer}
                        value={password} 
                        onChangeText={text => setPassword(text)}
                      />
                      <TextInput placeholder='비밀번호를 다시 입력해주세요' style={styles.inputContainer}/>
                    </View>
        
                    <View>
                      <Text style={styles.title}>* 이름</Text>
                      <TextInput 
                        placeholder='이름을 입력해주세요' 
                        style={styles.inputContainer}
                        value={name} 
                        onChangeText={text => setName(text)}
                      />
                    </View>
        
                    <View>
                      <Text style={styles.title}>* 휴대폰 번호</Text>
                      <TextInput 
                        placeholder='휴대폰 번호를 입력해주세요' 
                        style={styles.inputContainer}
                        value={phone} onChangeText={text => setPhone(text)}
                      />
                    </View>
            
                    <View>
                      <Text style={styles.title}>* 닉네임</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TextInput 
                          placeholder='닉네임을 입력해주세요' 
                          style={[styles.inputContainer, styles.small]}
                          value={nickName} 
                          onChangeText={text => setNickName(text)}
                        />
                        <Pressable style={styles.btn}>
                          <Text style={{fontSize: 14, color: '#1AAD55'}}>
                            중복확인
                          </Text>
                        </Pressable>
                      </View>
                    </View>
        
                
                      <Text style={styles.title}>약관동의</Text>
                      <View style={styles.agreeContainer}>
{/*         
                          약관동의 */}
                          {/* <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                              <CheckBox 
                                  checked={checked} 
                                  onPress={() => setChecked(!checked)} 
                                  checkedIcon="checkbox-outline"
                                  iconType="material-community"
                                  uncheckedIcon={'checkbox-blank-outline'}
                                  containerStyle={{width: 45, height: 45, backgroundColor: '#ECECEC'}} />
                              <Text style={{color: '#424242'}}>전체동의</Text>
                          </View>
                          
                          <Ionic name="chevron-down" style={{fontSize: 20, marginRight: 10, color: '#363636'}}/> */}
                      </View>
        
                  </View>
        
                </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAwareScrollView>
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
            marginBottom: 6,
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            paddingHorizontal: 16,
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
          }
        })
        
        
        export default SignUp;