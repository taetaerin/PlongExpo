import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActionSheetIOS, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';



  const CommentContainer = ({postId, uid}) => {
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });

      return () => unsubscribe();
    }, []);


    const isCurrentUserAuthor = currentUser && currentUser.uid === uid;

    const handleAction = async (commentId) => {
      console.log('a', commentId)
      if (isCurrentUserAuthor) {
        // 로그인한 사용자가 글 작성자인 경우
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['수정하기', '삭제하기', '취소'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2,
          },
          async (buttonIndex) => {
            if (buttonIndex === 0) {
              // '수정하기' 선택 시 동작
              await handleEdit();
            } else if (buttonIndex === 1) {
              // '삭제하기' 선택 시 동작
              await handleDelete(commentId);
            }
          }
        );
      } else {
        // 로그인한 사용자가 글 작성자가 아닌 경우
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['신고하기', '취소'],
            cancelButtonIndex: 1,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              // '신고하기' 선택 시 동작
              Alert.alert('해당 게시물이 신고되었습니다')
            }
          }
        );
      }
    };

    //댓글 삭제하기
    const handleDelete = async (commentId) => {
      try {
        // 게시물을 삭제하기 위해 게시물 문서의 레퍼런스를 가져오기
        const commentsDocRef = doc(firestore, 'comments', commentId);
    
        // 게시물 문서를 삭제
        await deleteDoc(commentsDocRef);
    
        // 게시물 삭제 후, 화면을 새로고침 -> 나중에 삭제해주기
        // fetchPosts();
      } catch (error) {
        console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      }
    };


    useEffect(() => {
        // Fetch comments for the specific post from Firestore
        const fetchComments = async () => {
          try {
            const commentsRef = collection(firestore, 'comments');
            const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'asc'));
            const querySnapshot = await getDocs(q);
            const fetchedComments = querySnapshot.docs.map((doc) => {
              const commentData = doc.data();
              return {
                ...commentData,
                id: doc.id, // 추가: 댓글의 id 값을 포함시킴
              };
            });
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
                                  <TouchableOpacity onPress={() => handleAction(data.id)}>
                                    <Ionic name='md-ellipsis-horizontal' size={17} color='#424242' />
                                  </TouchableOpacity>
                                    
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