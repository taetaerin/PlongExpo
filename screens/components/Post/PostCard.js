import {StyleSheet, Text, View, Image, TouchableOpacity, ActionSheetIOS, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import {  collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../../firebase';

const PostCard = ({ name, image, date, text, avatar, id, uid, likesCount}) => {

  const navigation = useNavigation();

  //댓글 개수 기능
  const [commentCount, setCommentCount] = useState(0);

  //파이어베이스 comments 컬랙션 
  useEffect(() => {
    const commentsRef = collection(firestore, 'comments');
    const q = query(commentsRef, where('postId', '==', id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // 댓글 수를 가져와서 설정
      setCommentCount(querySnapshot.size); 

      // 해당 게시물의 commentCount 업데이트
      const postDocRef = doc(firestore, 'posts', id);
      updateDoc(postDocRef, { commentCount: querySnapshot.size });
    });

    return () => unsubscribe(); 
  }, [id]);

  //수정하기 클릭 시 PostEdit로 이동
  const handleEdit = async () => {
    //PostEdit로 postId 보내주기
    navigation.navigate('PostEdit', { postId: id });
  };

  
  //삭제하기 클릭 시 게시물 삭제하기
  const handleDelete = async () => {
    try {
      // 게시물을 삭제하기 위해 게시물 문서의 레퍼런스를 가져오기
      const postDocRef = doc(firestore, 'posts', id);
      
      // 게시물 문서를 삭제
      await deleteDoc(postDocRef);
      
    } catch (error) {
      console.error('게시물 삭제 중 오류가 발생했습니다:', error);
    }
  };
  
  //이파리(좋아요) 클릭 기능
  const [liked, setLiked] = useState(false);
 
  // 이파리(좋아요) 기능
  const handleLike = async () => {
    try {
      const postDocRef = doc(firestore, 'posts', id);

      // 좋아요를 토글하기 전에 좋아요 여부를 업데이트
      const newLikedStatus = !liked;

      if (newLikedStatus) {
        // 좋아요: 좋아요 수를 1 증가시키고 Firestore 업데이트
        const newLikesCount = likesCount + 1;
        await updateDoc(postDocRef, { likes: newLikesCount });
      } else {
        // 좋아요 취소: 좋아요 수를 1 감소시키고 Firestore 업데이트
        const newLikesCount = likesCount - 1;
        await updateDoc(postDocRef, { likes: newLikesCount });
      }

      // 글의 좋아요 상태를 로컬 상태에 업데이트
      setLiked(newLikedStatus);
    } catch (error) {
      console.error('좋아요 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);


  const isCurrentUserAuthor = currentUser && currentUser.uid === uid;

  //더보기 아이콘 눌렀을때
  const handleAction = async () => {
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
            await handleDelete();
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
  
  return (
    
    <View style={{paddingTop: 6, paddingBottom: 16, paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>

        <View style={{flexDirection: 'row', marginVertical: 14}}>
            {/* 아바타 이미지 */}
            {avatar ? (
              <Image source={{url: avatar}} style={styles.avatar}/>
            ) : (
              <View style={styles.avatar}/>
            )}
            

            {/* 사용자 이름, 게시물 날짜 */}
            <View style={{flex: 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.date}>{date}</Text>
                    </View>

                    {/* more 아이콘 */}
                    <TouchableOpacity onPress={handleAction}>
                      <Ionic name='md-ellipsis-horizontal' size={17} color='#424242' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      
        {/* 사용자 작성 글 */}
        <Text style={styles.text}>{text}</Text>
    
        
        {/* 사용자 업로드 사진 */}
        {image && <Image source={{url : image}} style={styles.image} resizeMode='cover'/>}


        {/* 새싹하고 댓글 아이콘 */}
        <View style={{flexDirection: 'row', marginTop: 14}}>
            <TouchableOpacity onPress={handleLike}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                  {liked ? (
                    <Ionic name='leaf-outline' size={24} color="green" style={{ marginRight: 4 }} />
                  ) : (
                    <Ionic name='leaf-outline' size={24} style={{ marginRight: 4 }} />
                  )}
                  <Text style={{fontSize: 14}}>{likesCount}</Text>
              </View>
            </TouchableOpacity>


            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                <Ionic name='ios-chatbubble-ellipses-outline' size={23} style={{marginRight: 4}} />
                <Text style={{fontSize: 14}}>{commentCount}</Text>
            </View>
        </View>
    </View>
  );
}

export default PostCard;

const styles = StyleSheet.create({
  avatar: {
    width: 37,
    height: 37,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: '#E7E7E7'
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  }, 
  date: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 4,
  },
  text: {
    lineHeight: 16*1.6,
    fontSize: 16,
    color: '#686868',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginTop: 18,
  },
})
