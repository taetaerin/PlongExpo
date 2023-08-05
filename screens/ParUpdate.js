import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable, TextInput, Button, Platform, ScrollView } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { locale } from 'moment';


Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;
   
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
      switch ($1) {
          case "yyyy": return d.getFullYear();
          case "yy": return (d.getFullYear() % 1000).zf(2);
          case "MM": return (d.getMonth() + 1).zf(2);
          case "dd": return d.getDate().zf(2);
          case "E": return weekName[d.getDay()];
          case "HH": return d.getHours().zf(2);
          case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
          case "mm": return d.getMinutes().zf(2);
          case "ss": return d.getSeconds().zf(2);
          case "a/p": return d.getHours() < 12 ? "오전" : "오후";
          default: return $1;
      }
  });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

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


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("dateFormat: ", date.format("yyyy-MM-dd"));
        hideDatePicker();
        onChangeText(date.format("yyyy-MM-dd"))
    };

    const placeholder = "YYYY - MM - DD";
    

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}} >
      <ScrollView>
        <View >
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
                  <TouchableOpacity onPress={showDatePicker}>
    
                <TextInput 
                  pointerEvents="none"
                  style={styles.input}
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor="#C3C3C3"
                  underlineColorAndroid="transparent"
                  editable={false}
                  value={text}
                  ></TextInput>
                  
                <DateTimePickerModal
                  headerTextIOS={placeholder}
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}>
                </DateTimePickerModal>
              </TouchableOpacity>	
                        </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{marginLeft: 30}}>
                  <TextInput 
                      pointerEvents="none"
                      style={styles.time}
                      placeholder="00시"
                      placeholderTextColor="#C3C3C3"
                      underlineColorAndroid="transparent"
                      editable={false}
                      value={text}
                      />
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
    }

    
})


export default ParUpdate;

             