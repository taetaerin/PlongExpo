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
    date: '5월 14일'
  },
  {
    id: 2,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/y.jpg'),
    title: '여의도에서 플로깅 같이해요!!',
    location: '영등포구',
    date: '5월 16일'
  },
  {
    id: 3,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/ttook.jpg'),
    title: '뚝섬 유원지 플로깅',
    location: '성동구',
    date: '5월 23일'
  },
  {
    id: 4,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/63.jpg'),
    title: '63빌딩 앞 한강공원',
    location: '영등포구',
    date: '5월 7일'
  },
  {
    id: 5,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/jr.jpg'),
    title: '중랑천 플로깅',
    location: '중랑구',
    date: '5월 29일'
  },
  {
    id: 6,
    avatar: require('../assets/images/avatar.jpeg'),
    name: 'fdnk111',
    image: require('../assets/images/cg.jpg'),
    title: '청계천 플로깅해요',
    location: '성동구',
    date: '5월 20일'
  }
]

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
        <Ionic name="md-add" size={27} color='#424242'></Ionic>
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
              <TouchableOpacity onPress={() => navigation.navigate('Content', {data})} >
                <ImplementCard  key={index} avartar={data.avatar} name={data.name} title={data.title} image={data.image}
                location={data.location} date={data.date}/>
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