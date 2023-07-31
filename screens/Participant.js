import { View, Text, ScrollView,  StyleSheet, SafeAreaView, Image,  TouchableOpacity, Platform, Pressable, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ImplementCard from './components/ParCard'; 


const Par = [
  {
    id: 1,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/seoulforest.jpg'),
    title: '서울숲에서 같이 플로깅 하실 분 모집합니다!',
    location: '성동구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 14일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
  },
  {
    id: 2,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/y.jpg'),
    title: '여의도에서 플로깅 같이해요!!',
    location: '영등포구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 16일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
  },
  {
    id: 3,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/ttook.jpg'),
    title: '뚝섬 유원지 플로깅',
    location: '성동구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 23일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
  },
  {
    id: 4,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/63.jpg'),
    title: '63빌딩 앞 한강공원',
    location: '영등포구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 7일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
  },
  {
    id: 5,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/jr.jpg'),
    title: '중랑천 플로깅',
    location: '중랑구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 7일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
  },
  {
    id: 6,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/cg.jpg'),
    title: '청계천 플로깅해요',
    location: '성동구',
    where: '서울 성동구 뚝섬로 273',
    date: '5월 7일',
    day: '일요일',
    time: '14:00',
    meterials: '봉투, 집게',
    situation: '모집중',
    content: '안녕하세요! 서울숲에서 플로깅을 하려합니다. 시민분들의 많은 참여 부탁드립니다.zdmclzlmzzzzzzzzzzzzzzzzzz'
}]


const Participant = ({navigation}) => {
  

 
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <ScrollView>
        <View 
          style={{
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent:'space-between', 
          marginHorizontal: 14,
          height: 44}}>
        <TouchableOpacity onPress={() => navigation.navigate('ParUpdate')}>
        <Ionic name="md-add" size={27} color='#424242'></Ionic>
        </TouchableOpacity>
        <Text style={styles.title}>모집글</Text>
        <Ionic name="md-search-outline" size={27} color='#424242'></Ionic>
      </View>

        <View style={{ flexDirection: 'row', marginTop:30}}>
        <TouchableOpacity>
          <Text style={styles.subtitle}>모집중</Text>
          </TouchableOpacity>
          <TouchableOpacity>
          <Text style={styles.subtitle}>모집완료</Text>
          </TouchableOpacity>
          <TouchableOpacity>
          <Text style={styles.subtitle}>스크랩</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
         
        {Par.map((data, index) => {
            return(
              <TouchableOpacity onPress={() => navigation.navigate('ParContent', {data})} >
                <ImplementCard  key={index} avatar={data.avatar} name={data.name} title={data.title} image={data.image}
                location={data.location} where={data.where} date={data.date} day={data.day} time={data.time} 
                meterials={data.meterials} situation={data.situation} content={data.content}/>
              </TouchableOpacity>
            )
          })}
          
          </View>
    </ScrollView>
    </SafeAreaView>
  )
  }


const styles = StyleSheet.create({
 
  // container: {
  //   flex: 1,
  //   paddingTop: Platform.OS === 'android' ? 20 : 0,
  //   backgroundColor: '#F5F5F5'
  // },
   title: {
    
    fontSize: 22,
    textAlign: 'center',
    color: '#48566A'
  },
  subtitle: {
    fontSize: 16,
    color: '#868686',
    marginLeft: 18,
    fontWeight: 'bold'
  },

  
  container: {
    flexDirection: 'row',
    justifyContent: "space-around",
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
})

export default Participant