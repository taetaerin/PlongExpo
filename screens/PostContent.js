import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommentInput from './CommentInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommentContainer from './CommentContainer';

const PostContent = ({navigation, route}) => {
  const { item } = route.params

  return (
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>

              {/* 상단바 */}
              <View 
                  style={{
                    width: '100%', 
                    backgroundColor: 'white', 
                    height: 44, 
                    paddingHorizontal: 18,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#EAEAEA',
                    justifyContent:'center'}}
                  >
                    <TouchableOpacity>
                        <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
              </View>
              
              <View style={{paddingHorizontal: 18, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA'}}>
                  {/* 사용자 정보 컨테이너 */}
                  <View style={{flexDirection: 'row', marginVertical: 14}}>
                      <Image source={{url: item.avatar}} style={styles.avatar}/>

                      {/* 사용자 이름, 게시물 날짜 */}
                      <View style={{flex: 1}}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                              <View>
                                <Text style={styles.name}>{item.nickName}</Text>
                                <Text style={styles.date}>{item.dateTime}</Text>
                              </View>

                              {/* more 아이콘 */}
                              <Ionic name='md-ellipsis-horizontal' size={17} color='#424242' />
                          </View>
                      </View>
                  </View>

                  {/* 사용자 작성 글 */}
                  <Text style={styles.text}>{item.content}</Text>
            
                  {/* 사용자 업로드 사진 */}
                  {item.imageUrl && <Image source={{url: item.imageUrl}} style={styles.image} resizeMode='cover' />} 
                  
                  {/* 새싹하고 댓글 아이콘 */}
                  <View style={{flexDirection: 'row', marginTop: 14}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                          <Ionic name='leaf-outline' size={24} style={{marginRight: 4}} />
                          <Text style={{fontSize: 14}}>{item.likes}</Text>
                      </View>

                      <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                          <Ionic name='ios-chatbubble-ellipses-outline' size={23} style={{marginRight: 4}} />
                          <Text style={{fontSize: 14}}>{item.commentCount}</Text>
                      </View>
                  </View>
              </View>
              
              {/* 댓글 컨테이너 */}
              <CommentContainer postId={item.id} uid={item.uid} />
              
            </View>
          </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      
      {/* 댓글 입력창 */}
      <CommentInput postId={item.id} />
    </SafeAreaView>
  )
}



export default PostContent

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
    marginRight: 10,
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