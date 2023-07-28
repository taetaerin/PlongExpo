import {View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, StyleSheet, StatusBar, ScrollView, Platform} from 'react-native'
import React, { useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';

const Profile = ({navigation}) => {
    const [text, onChangeText] = useState('');
    const [number, onChangeNumber] = useState('');
    const [inputText, setinputText] = useState('');
    
    const onPressSaveEdit = () => {
    }
    const[selectImage, setSelectImage] = useState(null);

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
                        source={{uri: selectImage}} 
                    />
                </View>

                <View style={{marginLeft: 25, paddingTop: 50}}>
                    <Text style={styles.nameText}>
                        홍길동 님
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


