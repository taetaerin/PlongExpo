import {View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet, StatusBar, ScrollView, Platform, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Circle from './components/Map/Circle';
import moment from 'moment';

const Profile = ({navigation, user}) => {
    //닉네임 설정
    const [nickName, setNickName] = useState('');
    //프로필 설정
    const [profilePictureURI, setProfilePictureURI] = useState(null);

    //선택한 날짜 정보
    const [selectedDateInfo, setSelectedDateInfo] = useState({
      calories: 0, 
      timer: 0,    
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [monthlyCalories, setMonthlyCalories] = useState(0);
    console.log('month모', monthlyCalories)
    const [, forceRender] = useState();

    //파이어베이스 - 파이어스토어 닉네임, 프로필 사진 가져오기
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
          } else {
            console.log('해당 사용자를 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        }
      };
        fetchUserData();
    }, [user.nickName]);

    //파이어베이스에 저장된 프로필 사진 가져오기
    useEffect(() => {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'users', user.uid);
  
  
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.nickName) {
            setNickName(userData.nickName);
          }
          if (userData.profilePicture) {
            setProfilePictureURI(userData.profilePicture);
          }
        } else {
          console.log('해당 사용자를 찾을 수 없습니다.');
        }
      });
  
      return () => unsubscribe();
    }, [user.profilePicture]);
  

    //칼로리 데이터베이스 가져오기
    const handleDateSelect = (date) => {
      const selectedDateKey = date.dateString;
  
      const fetchSelectedDateData = async () => {
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        const ploggingDataRef = collection(firestore, 'map');
  
        try {
          const userDoc = await getDoc(userRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userId = userData.userId;
  
            const querySnapshot = await getDocs(
              query(ploggingDataRef, where('userId', '==', user.uid), where('dateTime', '==', selectedDateKey))
            );
  
            if (!querySnapshot.empty) {
              const ploggingData = querySnapshot.docs[0].data();
              setSelectedDateInfo({
                calories: ploggingData.calories,
                timer: ploggingData.timer,
              });
            } else {
              setSelectedDateInfo({
                calories: 0,
                timer: 0,
              });
            }
          } else {
            console.log('해당 사용자를 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('선택된 날짜의 데이터 가져오기 오류:', error);
        }
      };
  
      fetchSelectedDateData();
      setSelectedDate(selectedDateKey); // 선택된 날짜 업데이트
    };

  
    const markedDates = {};
    if (selectedDate) {
      markedDates[selectedDate] = { selected: true, selectedColor: '#0BE060' };
    }
    LocaleConfig.locales['ko'] = {
      monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
      dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
      dayNamesShort: ['일', '월','화','수','목','금','토'],
    };
    LocaleConfig.defaultLocale = 'ko';
  
    //ㅗㅗ 
    // useEffect(() => {
    //   const fetchMonthlyCalories = async () => {
    //     const auth = getAuth();
    //     const user = auth.currentUser;
    //     const userId = user.uid;
    //     const firestore = getFirestore();
    //     const currentDate = moment().format('YYYY-MM-DD');
    //     const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  
    //     try {
    //       const querySnapshot = await getDocs(
    //         query(
    //           collection(firestore, 'map'),
    //           where('userId', '==', userId),
    //           where('dateTime', '>=', firstDayOfMonth),
    //           where('dateTime', '<=', currentDate)
    //         )
    //       );

    //       let totalCalories = 0;
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         totalCalories += data.calories;
    //       });
  
    //       setMonthlyCalories(totalCalories);
    //     } catch (error) {
    //       console.error('한 달 동안의 칼로리를 불러오는 중 오류 발생:', error);
    //     }
    //   };
  
    //   fetchMonthlyCalories(); // 데이터를 가져오고 상태를 업데이트하는 함수 호출
    //   forceRender(Math.random());
    //   // useEffect 내부에서 상태나 함수를 사용하는 경우 의존성 배열에 해당 상태나 함수를 추가
    // }, []);
    
    const fetchMonthlyCalories = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      const firestore = getFirestore();
      const currentDate = moment().format('YYYY-MM-DD');
      const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    
      try {
        const querySnapshot = await getDocs(
          query(
            collection(firestore, 'map'),
            where('userId', '==', userId),
            where('dateTime', '>=', firstDayOfMonth),
            where('dateTime', '<=', currentDate)
          )
        );
    
        let totalCalories = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalCalories += data.calories;
        });
    
        setMonthlyCalories(totalCalories);
      } catch (error) {
        console.error('한 달 동안의 칼로리를 불러오는 중 오류 발생:', error);
      }
    };
    
     //불러오기
     useEffect(() => {
      // 주기적으로 fetchMonthlyCalories 함수를 호출하여 월간 칼로리 업데이트
      const interval = setInterval(() => {
        fetchMonthlyCalories();
      }, 60000); // 1분마다 호출하도록 설정 (밀리초 단위)
    
      //컴포넌트 언마운트 시 clearInterval을 통해 감시 해제
      return () => clearInterval(interval);
    }, []);



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
                      <Text style={{fontSize: 22, color: '#424242'}}>프로필</Text>
                  </View>
            </View>
          <ScrollView> 

            {/* 프로필 컨테이너 */}
            <View style={{flexDirection: 'row', height: 150, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>
                <View style={{justifyContent:'center'}}>
                    <Image 
                        style={{backgroundColor: '#EFEFEF',left: 16, width: 100, height: 100, borderRadius: 100}} 
                        source={{uri: profilePictureURI}} />
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

            {/* 활동량 */}
            <Circle monthlyCalories={monthlyCalories} />

            <View style={{marginTop: 24, marginBottom: 8}}> 
              <Text style={styles.subTitle}>
                  플로깅 기록
              </Text>
            </View>

            {/* 캘린더 라이브러리*/}
            <View style={{paddingHorizontal: 18}}>
                <Calendar
                 style={styles.calendar}
                 markedDates={markedDates}
                 onDayPress={(day) => handleDateSelect(day)} 
                 //onDayPress={handleDayPress}
                 theme={{
                  selectedDayBackgroundColor: '#0BE060', // 선택된 날짜의 배경색
                  selectedDayTextColor: 'white',         // 선택된 날짜의 텍스트색
                  todayTextColor: '#0BE060',             // 오늘 날짜의 텍스트색
                  dayTextColor: '#424242',               // 다른 날짜의 텍스트색
                  arrowColor: '#0BE060',                // 화살표 색상
                  dotColor: '#0BE060',     
                 }} />
            </View>


            <View style={{backgroundColor: '#E4EAF1', borderRadius: 5, marginHorizontal: 18, marginVertical: 10, height: 60}}>
                 <Text style={styles.txt}>시간: {selectedDateInfo.timer} 초</Text>
                 <Text style={styles.txt}>칼로리: {selectedDateInfo.calories} kcal</Text>
            </View>
         
            <View style={{marginVertical: 10}}>
              <TouchableOpacity style={styles.touchBox} >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={styles.text}>
                          내가 작성한 게시물
                      </Text>
                      <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                </View>
              </TouchableOpacity>

              <View style={styles.line}></View>

              <TouchableOpacity style={styles.touchBox} >
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Text style={styles.text}>
                          내가 작성한 모집글
                      </Text>
                      <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                </View>
              </TouchableOpacity>

              <View style={styles.line}></View>

              <TouchableOpacity style={styles.touchBox} onPress={() => navigation.navigate('EditProfile')} >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={styles.text}>
                            프로필 관리
                        </Text>
                        <Ionic name= "chevron-forward-sharp" size={20} color="#CBCBCB" />
                  </View>
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
              <Text style={{fontSize: 14,color: '#A5A5A5'}}>
                  로그아웃  |
              </Text>
              <Image 
                style={{ marginLeft:7, width:56, height:14, resizeMode:'contain'}}
                source={require('../assets/images/Logo.png')}
              />
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
        color: '#424242',
    },
    txt: {
      fontSize: 16,
      color: '#424242',
      top: 5,
      marginVertical: 3,
      marginHorizontal: 10
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
    },
    
}
)

export default Profile;


