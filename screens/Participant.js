import { View, Text, ScrollView,  StyleSheet, SafeAreaView, Image,  TouchableOpacity, Platform, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ImplementCard from './components/ParCard'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase';


const Participant = ({navigation}) => {
  const [participant, setParticipant] = useState([]);

  const [activeTab, setActiveTab] = useState('모집중');


  // 참여하기 데이터 가져오기 
  const fetchParticipant = async () => {
    try {
      const participantCollectionRef = collection(firestore, 'participant');
      onSnapshot(participantCollectionRef, (querySnapshot) => {
        const fetchParticipant = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetchParticipant.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
        setParticipant(fetchParticipant);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useLayoutEffect(() => {
    fetchParticipant();
  }, []);


  //모집중, 모집완료, 스크랩 기능
  const filteredParticipant = participant.filter(data => {
    if (activeTab === '모집중') {
      return data.state === '모집중' || data.scrap === true;
    } else if (activeTab === '모집완료') {
      return data.state === '모집완료';
    } else if (activeTab === '스크랩') {
      return data.scrap === true;
    }
    return false;
  });

 
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      {/* 상단바 */}
      <View 
        style={{
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent:'space-between', 
        marginHorizontal: 14,
        height: 44,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('ParUpdate')}>
          <Ionic name="md-add" size={26} color='#424242'></Ionic>
        </TouchableOpacity>

        <Text style={styles.title}>모집글</Text>

        <Ionic name="md-search-outline" size={24} color='#424242'></Ionic>
      </View>
      
      {/* 모집중 모집완료 스크랩 */}
      <View style={{ flexDirection: 'row', marginTop:30, marginBottom: 10}}>
        <TouchableOpacity onPress={() => setActiveTab('모집중')}>
          <Text style={[styles.subtitle, { color: activeTab === '모집중' ? '#48566A' : '#A8A8A8' }]}>모집중</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('모집완료')}>
          <Text style={[styles.subtitle, { color: activeTab === '모집완료' ? '#48566A' : '#A8A8A8' }]}>모집완료</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setActiveTab('스크랩')}>
          <Text style={[styles.subtitle, { color: activeTab === '스크랩' ? '#48566A' : '#A8A8A8' }]}>스크랩</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>

        <View style={styles.container}>
      
          {filteredParticipant.map((data, index) => {
              return(
                <TouchableOpacity key={data.id} onPress={() => navigation.navigate('ParContent', {data})}>
                  <ImplementCard  
                    id={data.id} 
                    avatar={data.avatar} 
                    name={data.nickName} 
                    title={data.title} 
                    content={data.content}
                    image={data.imageUrl}
                    location={data.location} 
                    date={data.date} 
                    openText ={data.openText}
                    state={data.state}
                    key={data.id}
                  />
                </TouchableOpacity>
              )
            })}
          
        </View>
        
        {/* <View style={{height: 100}} /> */}
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
    fontSize: 17,
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