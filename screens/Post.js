import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, RefreshControl} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import {  collection, onSnapshot} from 'firebase/firestore';
import firebase, { firestore } from '../firebase';
import PostCard from './components/Post/PostCard';


const Post = ({navigation, route}) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 게시판 데이터 가져오기 
  const fetchPosts = async () => {
    try {
      const postCollectionRef = collection(firestore, 'posts');
      onSnapshot(postCollectionRef, (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetchedPosts.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
        setPosts(fetchedPosts);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View 
          style={{
            width: '100%', 
            height: 44, 
            alignItems: 'center', 
            justifyContent:'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#EAEAEA',
          }}
          >
            <View style={styles.postContainer}>
                <Text style={{fontSize: 22, color: '#48566A'}}>게시판</Text>

                {/* 플러스 아이콘 */}
                <View style={{ position: 'absolute', right: -145 }}>
                  <TouchableOpacity onPress={() => navigation.navigate('PostUpdate')}>
                    <Ionic name='add-outline' color="#686868" style={{fontSize: 26}} />
                  </TouchableOpacity>
                </View>
            </View>
        </View>

     
        {/* 게시판 컨테이너 */}
        <FlatList
          style={{borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}
          data={posts}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} />
          }
          renderItem={({ item }) => 
            <TouchableOpacity onPress={() => navigation.navigate('PostContent', {item})}>
              <PostCard
                image={item.imageUrl} 
                name={item.nickName} 
                date={item.dateTime} 
                text={item.content} 
                avatar={item.avatar} 
                id={item.id}
                likesCount={item.likes} 
                uid={item.uid}
              />
            </TouchableOpacity>
          }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems:'center',
  },
})

export default Post;