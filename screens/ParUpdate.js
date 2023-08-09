import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable, TextInput, Button, Platform, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { PreventRemoveContext } from '@react-navigation/native';


const ParUpdate = ({route, navigation}) => {
    //사진 선택
  const [image, setImage] = useState(null);

  //저장 함수
  const onPressSaveEdit = () => {

  };
  const [text, value, onChangeText] = React.useState("");

 

  const pickImage = async () => {
      // No permissions request is necessary for launching the image library
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
    const [timeOfPlong, setTimeOfPlong] = useState("")
    
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const toggleDatepicker = () => {
      setShowPicker(!showPicker);
    };
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

    const confirmIOSDate = () => {
      setDateOfPlong(formatDate(date));
      toggleDatepicker();
    };

    const formatDate = (rawDate) => {
      let date = new Date(rawDate);

      let year = date.getFullYear();
      let month = date.getMonth() +1;
      let day = date.getDate();

      return `${year}-${month}-${day}`;
    }

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}} >
      <ScrollView>
        <View >
          <KeyboardAwareScrollView>
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
                      
                        <TouchableOpacity>
                            <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.update}>등록</Text>
                        </TouchableOpacity>
                </View>
            
                <TouchableOpacity onPress={pickImage}>
                    <Image style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', height: 146, width: 390}} 
                     source={{ uri:image }}/>
                <Ionic name="camera-outline" style={{fontSize:28, color: 'white',marginTop: -30, left: 347}} />
            </TouchableOpacity>
                  <View style={styles.wrapper}>
                  <View style={{justifyContent: 'space-between'}}>
                  <TextInput
                  style={styles.title}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="모임이름입력"
                  placeholderTextColor={'#7F7F7F'}
                  />
                 
                  <TextInput
                  style={styles.content}
                   editable
                   multiline
                   numberOfLines={10}
                   maxLength={100}
                     onChangeText={onChangeText}
                    value={value}
                    placeholder="내용 작성"
                  ></TextInput>
                 <View style={styles.line}></View>
                  </View>
                  
                  <Text style={styles.information}>모임 정보</Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Ionic name='calendar-outline' size={28} color='#424242'></Ionic>
                  
                  
            
                  <View>
                  
                      {showPicker && ( 
                      <DateTimePicker
                          mode="date"
                          display="spinner"
                          value={date}
                          onChange={onChange}
                          style={styles.datePicker}
                        />
                        )}
                        {showPicker && Platform.OS === "ios" &&(
                        <View style={{ justifyContent:'space-around',
                    flexDirection: 'row'}}
                     
                        >
                          <TouchableOpacity style={[
                            styles.button,
                            styles.pickerButtton,
                            {backgroundColor: "#F0F0F0"}
                          ]}
                          onPress={toggleDatepicker}>
                            <Text
                            style={[
                              styles.buttonText,
                              {color: '#3C80E1'}
                            ]}>취소</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[
                            styles.button,
                            styles.pickerButtton,
                            {backgroundColor: "#F0F0F0"}
                          ]}
                          onPress={confirmIOSDate}>
                            <Text
                            style={[
                              styles.buttonText,
                              {color: '#3C80E1'}
                            ]}>확인</Text>
                          </TouchableOpacity>
                        </View>
                        )}
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
                        <View style={{flexDirection: 'row'}}>
                          <View style={{marginLeft: 30}}>
                          {/* <DateTimePicker
                          mode="time"
                          display="spinner"
                          value={date}
                          onChange={onChange}
                          style={styles.datePicker}
                        /> */}
                            <Pressable>
                  <TextInput 
                      style={styles.time}
                      placeholder="00시"
                      placeholderTextColor="#C3C3C3"
                      editable={false}
                      value={text}
                      />
                      </Pressable>
                      </View>
                      <TextInput 
                      pointerEvents="none"
                      style={styles.time}
                      placeholder="00분"
                      placeholderTextColor="#C3C3C3"
                      underlineColorAndroid="transparent"
                      editable={false}
                      value={text}
                      />
                      </View>
                      
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Ionic name='location-outline' size={28} color='#424242'></Ionic>          
                        <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="장소를 입력하세요."
                        placeholderTextColor={'#7F7F7F'}
                        >
                      </TextInput>
                      
                      </View>
                      <TextInput
                        style={styles.others}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="기타를 입력하세요."
                        placeholderTextColor={'#7F7F7F'}
                        >
                      </TextInput>
                      <View style={styles.line}></View>
                      <Text style={styles.openchat}>오픈채팅 주소 입력</Text>
                      <TextInput
                        style={styles.chat}
                        onChangeText={onChangeText}
                        value={text}
                        placeholderTextColor={'#7F7F7F'}
                        >
                      </TextInput>

                                </View>
                                </KeyboardAwareScrollView>
                                </View>
                                </ScrollView>
                                </SafeAreaView>
                  )
                }

const styles = StyleSheet.create({
  wrapper : {
    // backgroundColor: 'yellow',
    paddingHorizontal: 20,
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
      width: 310,
      borderWidth: 1,
      padding: 10,
      borderColor: '#C3C3C3',
      borderRadius: 5
    },
    time: {
      marginLeft: 10,
      height: 40,
      width: 82,
      borderWidth: 1,
      padding: 10,
      borderColor: '#C3C3C3',
      borderRadius: 5,
      marginTop: 10
    },

    others: {
      marginLeft: 38,
      height: 40,
      width: 310,
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

             