import {View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet, StatusBar, ScrollView, Platform} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const Profile = ({navigation, user}) => {
    //닉네임 설정
    const [nickName, setNickName] = useState('');
    //프로필 설정
    const [profilePictureURI, setProfilePictureURI] = useState(null);

    //파이어베이스에 저장된 이미지 uri 가져오기
    // useEffect(() => {
    //     // Firestore에서 사용자 데이터 가져오기
    //     const fetchUserData = async () => {
    //     const firestore = getFirestore();
    //     const userRef = doc(firestore, 'users', user.uid);
  
    //     try {
    //       const docSnapshot = await getDoc(userRef);
    //       if (docSnapshot.exists()) {
    //         const userData = docSnapshot.data();
    //         // profilePicture가 존재하면 해당 URL을 상태 변수에 설정
    //         if (userData.profilePicture) {
    //           setProfilePictureURI(userData.profilePicture);
    //         }
    //         // 다른 필요한 사용자 데이터도 처리할 수 있습니다.
    //       } else {
    //         console.log('해당 사용자를 찾을 수 없습니다.');
    //       }
    //     } catch (error) {
    //       console.error('사용자 데이터 가져오기 오류:', error);
    //     }
    // };
  
    //   // Firestore에서 사용자 데이터 가져오기
    //   fetchUserData();
    // }, []); 

    //실험용 
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
            setProfilePictureURI(userData.profilePicture);
          }
          // 다른 필요한 사용자 데이터도 처리할 수 있습니다.
        } else {
          console.log('해당 사용자를 찾을 수 없습니다.');
        }
      });
  
      // 컴포넌트가 언마운트될 때 감시를 해제합니다.
      return () => unsubscribe();
    }, [user.profilePicture]);
  
    //파이어베이스에 저장된 닉네임 가져오기
    useEffect(() => {
         // Firestore에서 사용자 데이터 가져오기
        const fetchUserData = async () => {
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
    
        try {
          const docSnapshot = await getDoc(userRef);
    
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            // 닉네임이 존재하면 해당 닉네임을 상태 변수에 설정
            if (userData.nickName) {
              setNickName(userData.nickName);
            }
            // 다른 필요한 사용자 데이터도 처리할 수 있습니다.
          } else {
            console.log('해당 사용자를 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        }
      };
    
      fetchUserData();
    }, [user.nickName]);
    

    const markDates = {
        '2023-07-01': {
            selected: true,
        },
        '2023-07-02': {
            selected: true,
        },
        '2023-07-03': {
            selected: true,
        }
    };
 
    return (
        <SafeAreaView style={styles.container}>
            {/* 프로필 상단 컨테이너 */}
            <View 
                style={{
                  width: '100%', 
                  height: 44, 
                  paddingHorizontal: 18,
                  justifyContent:'center',
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#EAEAEA',
                }}>
                  <View>
                      <Text style={{fontSize: 20, color: '#424242'}}>프로필</Text>
                  </View>
            </View>
          <ScrollView> 

            {/* 프로필 컨테이너 */}
            <View style={{flexDirection: 'row', height: 150, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>
                <View style={{justifyContent:'center'}}>
                    <Image 
                        style={{backgroundColor: '#EFEFEF',left: 16, width: 100, height: 100, borderRadius: 100}} 
                        source={{uri: profilePictureURI}} 
                    />
                </View>

                <View style={{marginLeft: 25, paddingTop: 50}}>
                    <Text style={styles.nameText}>
                      {nickName && `${nickName} 님`}
                    </Text>   

                    <Text style={{marginTop: 14, color: '#424242', fontSize: 12}}>
                        플로깅으로 같이 환경을 깨끗이 만들어요~!
                    </Text>  
                </View>
     

            </View>

            <View style={{marginTop: 24, marginBottom: 8}}> 
              <Text style={styles.subTitle}>
                  플로깅 기록
              </Text>
            </View>

            {/* 캘린더 라이브러리*/}
            <View style={{paddingHorizontal: 18}}>
                <Calendar
                 style={styles.calendar}
                 markedDates={markDates}
                 theme={{
                    selectedDayBackgroundColor: '#0BE060',
                    arrowColor: '#0BE060',
                    dotColor: '#0BE060',
                    todayTextColor: '#0BE060',
                 }}
                />
            </View>

            <View style={{backgroundColor: '#E4EAF1', borderRadius: 5, marginHorizontal: 18, marginVertical: 10}}>
                 <Text style={styles.text}>거리:</Text>
                 <Text style={styles.text}>시간:</Text>
                 <Text style={styles.text}>칼로리:</Text>
            </View>

         
            <View style={{marginVertical: 10}}>
              <TouchableOpacity style={styles.touchBox} onPress={() => onPressSaveEdit()} >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={styles.text}>
                          내가 작성한 게시물
                      </Text>
                      <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                </View>
              </TouchableOpacity>

            <View style={styles.line}>
            </View>

            <TouchableOpacity style={styles.touchBox} onPress={() => onPressSaveEdit()} >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={styles.text}>
                          내가 작성한 모집글
                      </Text>
                      <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                </View>
              </TouchableOpacity>

            <View style={styles.line}>
            </View>

            <TouchableOpacity style={styles.touchBox} onPress={() => navigation.navigate('EditProfile')} >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={styles.text}>
                          프로필 관리
                      </Text>
                      <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'center'}}>
            <Text style={{
                fontSize: 14,
                color: '#A5A5A5'
            }}>
                로그아웃  |
            </Text>
                <Image style={{
                    marginLeft:7,
                    width:56,
                    height:14,
                    resizeMode:'contain'                 
                }}source={require('../assets/images/Logo.png')}/>
            </View>
          </ScrollView>
          
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        backgroundColor: 'white',
    },
    line: {
        borderBottomColor: '#CBCBCB',
        borderBottomWidth: 0.8
    },
    nameText: {
        fontSize: 20,
        color: '#424242',
       
    },
    subTitle: {
        fontSize: 18,
        left: 18,
        color: '#424242'
    },
    text: {
        fontSize: 16,
        color: '#424242',
        marginVertical: 3,
    },
    calendar: {
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        width: '100%',
        height: 350,
    },
    touchBox: {
      paddingHorizontal: 18, 
      justifyContent:'center', 
      marginVertical: 15
    }
    
}
)

export default Profile;


