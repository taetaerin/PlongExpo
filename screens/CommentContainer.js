import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';

const person = [
    {
      name: '주으닝',
      avatar: require('../assets/images/avatar.jpeg'),
      text: '수고하셨어요!!',
      date: '1분전',
    },
    {
      name: '태링',
      avatar: require('../assets/images/avatar.jpeg'),
      text: '플로깅 재밌네요 다음에 같이 또 해요~!!',
      date: '2023.05.07',
    }
  ]


  const CommentContainer = ({postId}) => {
    const [comments, setComments] = useState([]);


    useEffect(() => {
        // Fetch comments for the specific post from Firestore
        const fetchComments = async () => {
          try {
            const commentsRef = collection(firestore, 'comments');
            const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedComments = querySnapshot.docs.map((doc) => doc.data());
            setComments(fetchedComments);
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
        };
    
        fetchComments();
    
        // Subscribe to real-time updates when comments change
        const unsubscribe = onSnapshot(collection(firestore, 'comments'), () => {
          fetchComments();
        });
    
        return () => unsubscribe();
      }, [postId]);

    return(
      <View>
            {comments.map((data, index) => {
              return(
                <View key={index}>
  
                  <View style={{paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>
                      { /* 사용자 정보 컨테이너 */}
                      <View style={{flexDirection: 'row', marginVertical: 14}}>
                      {data.avatar ? (
                        <Image source={{url: data.avatar}} style={styles.avatar}/>
                        ) : (
                        <View style={styles.avatar}/>
                      )}
  
                        {/* 사용자 이름, 게시물 날짜 */}
                        <View style={{flex: 1}}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
  
                                <Text style={styles.name}>{data.nickName}</Text>
  
                              <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                                  <Text style={{fontSize: 12, color: '#8E8E8E',marginRight: 10}}>{data.timestamp}</Text>
                                  {/* more 아이콘 */}
                                  <Ionic name='md-ellipsis-horizontal' size={17} color='#424242' />
                              </View>
                          </View>
                        <Text style={{marginTop: 8, fontSize: 14}}>{data.text}</Text>
                        </View>
  
                      </View>
                  </View>
                </View>
              )
            })}
      </View>
    )
  }

  export default CommentContainer


const styles = StyleSheet.create({
    avatar: {
      width: 37,
      height: 37,
      borderRadius: 50,
      marginRight: 10,
      backgroundColor: '#E7E7E7'
    },
    name: {
      fontSize: 15,
      fontWeight: '500',
    }, 
    date: {
      fontSize: 12,
      color: '#8E8E8E',
      marginTop: 4,
      marginRight: 10,
    },
    text: {
      lineHeight: 21,
      fontSize: 14,
    },
    image: {
      width: '100%',
      height: 150,
      borderRadius: 4,
      marginTop: 18,
    },
  })