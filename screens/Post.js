import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const posts = [
  {
    id: 1,
    name: '홍길동',
    date: '2023.05.06 11시 30분',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    avatar: require('../assets/images/avatar.jpeg'),
    image: null,
    leaf: 20,
    comment: 5,
  },
  {
    id: 2,
    name: '임지수',
    date: '2023.05.06 11시 20분',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    avatar: require('../assets/images/avatar.jpeg'),
    image: require('../assets/images/image1.png'),
    leaf: 20,
    comment: 5,
  },
  {
    id: 3,
    name: '김주은',
    date: '2023.05.06 11시 19분',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    avatar: require('../assets/images/avatar.jpeg'),
    image: require('../assets/images/image1.png'),
    leaf: 20,
    comment: 5,
  },
]

const PostCard = ({ name, image, date, text, avatar, leaf, comment}) => {
  // item을 사용하는 코드 작성
  return (
    <View style={{paddingBottom: 10, paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>

        <View style={{flexDirection: 'row', marginVertical: 14}}>
            {/* 아바타 이미지 */}
            <Image source={avatar} style={styles.avatar}/>

            {/* 사용자 이름, 게시물 날짜 */}
            <View style={{flex: 1}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.date}>{date}</Text>
                    </View>

                    {/* more 아이콘 */}
                    <Ionic name='md-ellipsis-horizontal' size={17} color='#424242' />
                </View>
            </View>
        </View>
      
        {/* 사용자 작성 글 */}
        <Text style={styles.text}>{text}</Text>
        
        {/* 사용자 업로드 사진 */}
        {image && <Image source={image} style={styles.image} resizeMode='cover'/>}

        {/* 새싹하고 댓글 아이콘 */}
        <View style={{flexDirection: 'row', marginTop: 14}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                <MaterialCommunityIcons name='seed-outline' size={24} style={{marginRight: 4}} />
                <Text style={{fontSize: 14}}>{leaf}</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                <Ionic name='ios-chatbubble-ellipses-outline' size={23} style={{marginRight: 4}} />
                <Text style={{fontSize: 14}}>{comment}</Text>
            </View>
        </View>
    </View>
  );
}

const Post = () => {
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
                  <Ionic name='add-outline' color="#686868" style={{fontSize: 24}} />
                </View>
            </View>
        </View>
      <ScrollView>
        {/* 게시판 컨테이너 */}

        <FlatList
          style={{borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}
          data={posts}
          renderItem={({ item }) => <PostCard image={item.image} name={item.name} date={item.date} 
          text={item.text} avatar={item.avatar} leaf={item.leaf} comment={item.comment}/>}
          keyExtractor={item => item.id}
        />

        

      </ScrollView>
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