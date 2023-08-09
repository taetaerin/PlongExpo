import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable, TextInput, Button, Platform, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PreventRemoveContext } from '@react-navigation/native';
import LocationSearchScreen from './LocationSearchScreen';


const ParUpdate = ({route, navigation}) => {
    //사진 선택
  const [image, setImage] = useState(null);

  //저장 함수
  const onPressSaveEdit = () => {

  };
  
  const [text, value, onChangeText] = React.useState("");


  //이미지 저장 라이브러리
  const pickImage = async () => {
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

  //날짜선택
  const [dateOfPlong, setDateOfPlong] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  //시간선택
  const [timeOfPlong, setTimeOfPlong] = useState("");
  const [time, setTime] = useState(new Date());
  const [showTPicker, setShowTPicker] = useState(false);

  //날짜피커
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  //시간피커
  const toggleTimepicker = () => {
    setShowTPicker(!showTPicker);
  }

  //날짜변경
  const onChange = ({type}, selectedDate) => {
    if (type == "set"){
      const currentDate = selectedDate
      setDate(currentDate);
      if (Platform.OS ===" android"){
        toggleDatepicker();
        setDateOfPlong(formatDate(currentDate));
      }
    } else {
      toggleDatepicker();
    }
  };

  //시간변경
  const onChangeTime = ({type}, selectedTime) => {
    if (type == "set"){
      const currentTime = selectedTime
      setTime(currentTime);
      if (Platform.OS ===" android"){
        toggleTimepicker();
        setTimeOfPlong(formatTime(currentTime));
      }
    } else {
      toggleTimepicker();
    }
  };


  const confirmIOSDate = () => {
    setDateOfPlong(formatDate(date));
    toggleDatepicker();
  };

  const confirmIOSTime = () => {
    setTimeOfPlong(formatTime(time));
    toggleTimepicker();
  };

  //날짜 포맷
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() +1;
    let day = date.getDate();

    return `${year}-${month}-${day}`;
  }

  //시간 포맷
  const formatTime = (rawTime) => {
    let time = new Date(rawTime);

    let hours = time.getHours(); // 시
    let minutes = time.getMinutes();  // 분

    return `${hours}시 ${minutes}분`;
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      {/* 상단바 */}
      <View 
        style={{
          width: '100%', 
          backgroundColor: 'white', 
          height: 44, 
          alignItems: 'center', 
          paddingHorizontal: 18,
          justifyContent:'space-between',
          flexDirection: 'row'}}
      >
          {/* 뒤로가기 */}
          <TouchableOpacity>
              <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
          </TouchableOpacity>

          <TouchableOpacity>
              <Text style={styles.update}>등록</Text>
          </TouchableOpacity>
      </View>

      <ScrollView>
        <View >
          <KeyboardAwareScrollView>
            
            {/* 사진선택 */}
            <TouchableOpacity onPress={pickImage}>
                <Image style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', height: 146, width: 390}} 
                  source={{ uri:image }} />
                <Ionic name="camera-outline" style={{fontSize:28, color: 'white',marginTop: -30, left: 347}} />
            </TouchableOpacity>

            <View style={styles.wrapper}>
                <View style={{justifyContent: 'space-between'}}>
                
                  {/* 모임이름입력 */}
                  <TextInput
                    style={styles.title}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="모임이름입력"
                    placeholderTextColor={'#7F7F7F'}
                  />

                 {/* 내용작성 */}
                  <TextInput
                    style={styles.content}
                    editable
                    multiline
                    numberOfLines={10}
                    maxLength={100}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder="내용 작성"
                  />
                  
                  <View style={styles.line}></View>
                </View>
                  
                <Text style={styles.information}>모임 정보</Text>


                {/* 날짜 */}
                <View style={{flexDirection: 'row', marginTop: 10}}>
                
                  {/* 날짜 아이콘*/}
                  <Ionic name='calendar-outline' size={28} color='#424242' />
              
                      {/* 날짜선택 */}
                      <View>
                          {showPicker && ( 
                          <DateTimePicker
                              mode="date"
                              display="spinner"
                              value={date}
                              onChange={onChange}
                              style={styles.datePicker}
                              locale="ko"
                          />
                          )}

                          {/* 취소 / 확인 버튼 */}
                          {showPicker && Platform.OS === "ios" && (
                            <View style={{ justifyContent:'space-around', flexDirection: 'row'}}>
                              <TouchableOpacity style={[styles.button, styles.pickerButtton, {backgroundColor: "#F0F0F0"}]}
                                onPress={toggleDatepicker}>
                                <Text style={[styles.buttonText, {color: '#3C80E1'}]}>취소</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.button, styles.pickerButtton, {backgroundColor: "#F0F0F0"}]}
                                onPress={confirmIOSDate}>
                                <Text style={[styles.buttonText, {color: '#3C80E1'}]}>확인</Text>
                              </TouchableOpacity>
                            </View>
                            )}


                            {/* 날짜입력칸 */}
                            {!showPicker && ( 
                              <Pressable
                                onPress={toggleDatepicker}>
                                <TextInput
                                  style={styles.input}
                                  placeholder="YYYY - MM - DD"
                                  placeholderTextColor="#C3C3C3"                        
                                  editable={false}
                                  value={dateOfPlong}
                                  onChangeText={setDateOfPlong}
                                  onPressIn={toggleDatepicker}
                                  >
                                </TextInput>
                              </Pressable>
                            )}                       
                      </View>
                </View>

                {/* 시간 */}
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginLeft: 30}}>
                    {showTPicker && ( 
                      <DateTimePicker
                        mode="time"
                        display="spinner"
                        value={date}
                        onChange={onChangeTime}
                        style={styles.datePicker}
                      />
                    )}

                    {/* 취소 / 확인 버튼 */}
                    {showTPicker && Platform.OS === "ios" && (
                      <View style={{ justifyContent:'space-around', flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.button, styles.pickerButtton, {backgroundColor: "#F0F0F0"}]}
                          onPress={toggleTimepicker}>
                          <Text style={[styles.buttonText, {color: '#3C80E1'}]}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.pickerButtton, {backgroundColor: "#F0F0F0"}]}
                          onPress={confirmIOSTime}>
                          <Text style={[styles.buttonText, {color: '#3C80E1'}]}>확인</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* 시간 입력 칸 */}
                    {!showTPicker && ( 
                      <Pressable onPress={toggleTimepicker}>
                        <TextInput 
                          style={styles.time}
                          placeholder="00시  00분"
                          placeholderTextColor="#C3C3C3"
                          editable={false}
                          onChangeText={setTimeOfPlong}
                          value={timeOfPlong}
                          onPressIn={toggleTimepicker}
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
                      
                {/* 장소 */}
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <Ionic name='location-outline' size={28} color='#424242'></Ionic>          
                          
                  {/* 위치 정보 검색 */}
                  <LocationSearchScreen />
          
                </View>
  
                <View style={{borderBottomColor: '#CBCBCB', marginTop: 30, marginBottom: 10, borderBottomWidth: 0.8, width: '100%'}}></View>
                
                {/* 오픈 채팅 */}
                <View>
                  <Text style={styles.openchat}>오픈채팅 주소 입력</Text>
                  <TextInput
                    style={styles.chat}
                    onChangeText={onChangeText}
                    value={text}
                    placeholderTextColor={'#7F7F7F'}
                  />
                </View>
      
                <View style={{marginBottom: 50}}></View>

            </View>

          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper : {
    marginHorizontal: 18,
  },
  update: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold'
  },
  content: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold'
  },
  line: {
    borderBottomColor: '#CBCBCB',
    marginTop: 100,
    borderBottomWidth: 0.8,
    width: '100%'
  },
  information: {
    marginTop: 10,
    color: '#41993F',
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: {
    marginLeft: 10,
    height: 40,
    width: 300,
    borderWidth: 1,
    padding: 10,
    borderColor: '#C3C3C3',
    borderRadius: 5
  },
  time: {
    marginLeft: 9,
    height: 40,
    width: 150,
    borderWidth: 1,
    padding: 10,
    borderColor: '#C3C3C3',
    borderRadius: 5,
    marginTop: 10
  },
  chat: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    borderColor: '#C3C3C3',
    borderRadius: 5,
    marginTop: 10
  },
  openchat: {
    color: '#424242',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10
  },
  datePicker: {
    height: 120,
    marginTop: -10
  },
  button: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pickerButtton: {
    paddingHorizontal: 20,
  }    
})


export default ParUpdate;

             