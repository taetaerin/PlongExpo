import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, ActionSheetIOS, Alert} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import React, { useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import firebase, { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useNavigation } from '@react-navigation/native';

const hardPosts = [
  {
    id: 1,
    nickName: '홍길동',
    dateTime: '2023.05.06 11시 30분',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    // avatar: require('../assets/images/avatar.jpeg'),
    image: null,
    leaf: 20,
    comment: 5,
  },
  {
    id: 2,
    nickName: '임지수',
    dateTime: '2023.05.06 11시 20분',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    // avatar: require('../assets/images/avatar.jpeg'),
    // imageUrl: require('../assets/images/image1.png'),
    leaf: 20,
    comment: 5,
  },
  {
    id: 3,
    nickName: '김주은',
    dateTime: '2023.05.06 11시 19분',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    // avatar: require('../assets/images/avatar.jpeg'),
    // imageUrl: require('../assets/images/image1.png'),
    leaf: 20,
    comment: 5,
  },
]


const PostCard = ({ name, image, date, text, avatar, leaf, comment, id,uid, likes, likesCount, }) => {

  const navigation = useNavigation();

  const handleEdit = async () => {
    //PostEdit로 postId 보내주기
    navigation.navigate('PostEdit', { postId: id });
  };

  //이파리 클릭 기능
  const [liked, setLiked] = useState(false);

  //게시물 삭제하기
  const handleDelete = async () => {
    try {
      // 게시물을 삭제하기 위해 게시물 문서의 레퍼런스를 가져오기
      const postDocRef = doc(firestore, 'posts', id);
  
      // 게시물 문서를 삭제
      await deleteDoc(postDocRef);
  
      // 게시물 삭제 후, 화면을 새로고침 -> 나중에 삭제해주기
      // fetchPosts();
    } catch (error) {
      console.error('게시물 삭제 중 오류가 발생했습니다:', error);
    }
  };
  
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
    
    <View style={{paddingBottom: 10, paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>

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
                    <MaterialCommunityIcons name="seed-outline" size={24} color="green" style={{ marginRight: 4 }} />
                  ) : (
                    <MaterialCommunityIcons name="seed-outline" size={24} style={{ marginRight: 4 }} />
                  )}
                  <Text style={{fontSize: 14}}>{likesCount}</Text>
              </View>
            </TouchableOpacity>


            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                <Ionic name='ios-chatbubble-ellipses-outline' size={23} style={{marginRight: 4}} />
                <Text style={{fontSize: 14}}>{comment}</Text>
            </View>
        </View>
    </View>
  );
}

const Post = ({navigation, route}) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //post 사용자에게 보여지게 - 테스트용
  const fetchPosts = async () => {
    try {
      //파이어베이스에 있는 posts 가져오기
      const querySnapshot = await getDocs(collection(firestore, 'posts'));
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedPosts.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 게시판 데이터 가져오기 - 실시간 (이거 사용하기) 절대 지우지 마셈!!!!!1
  // const fetchPosts = async () => {
  //   try {
  //     const postCollectionRef = collection(firestore, 'posts');
  //     onSnapshot(postCollectionRef, (querySnapshot) => {
  //       const fetchedPosts = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       fetchedPosts.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  //       setPosts(fetchedPosts);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);


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
                    <Ionic name='add-outline' color="#686868" style={{fontSize: 24}} />
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
                leaf={item.likes} 
                comment={item.comment}
                id={item.id}
                likesCount={item.likes} 
                uid={item.uid}
                likes={item.likes}
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
    alignItems:'center'
  },

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
  line: {
    borderBottomColor: '#CBCBCB',
    marginBottom: 10,
    borderBottomWidth: 0.8,
    width: '100%'
  }
})

export default Post;