import { View, Text, ScrollView,  StyleSheet, SafeAreaView, Image,  TouchableOpacity, Platform, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ImplementCard from './components/ParCard'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';


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
  const [participant, setParticipant] = useState([]);

  // 게시판 데이터 가져오기 - 실시간 (이거 사용하기) 절대 지우지 마셈!!!!!1
  const fetchParticipant = async () => {
    try {
      const participantCollectionRef = collection(firestore, 'participant');
      onSnapshot(participantCollectionRef, (querySnapshot) => {
        const fetchParticipant = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // fetchParticipant.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
        setParticipant(fetchParticipant);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, []);
  

 
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {/* 상단바 */}
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
      
      {/* 모집중 모집완료 스크랩 */}
      <View style={{ flexDirection: 'row', marginTop:30, marginBottom: 10}}>
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

      <ScrollView>

        <View style={styles.container}>
      
          {participant.map((data, index) => {
              return(
                <TouchableOpacity onPress={() => navigation.navigate('ParContent', {data})}>
                  <ImplementCard  
                    key={index} 
                    avatar={data.avatar} 
                    name={data.nickName} 
                    title={data.title} 
                    content={data.content}
                    image={data.imageUrl}
                    location={data.location} 
                    date={data.date} 
                    openText ={data.openText}
                  />
                </TouchableOpacity>
              )
            })}
          
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

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
    flexWrap: 'wrap',
    justifyContent:'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
})

export default Participant