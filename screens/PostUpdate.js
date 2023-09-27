import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import moment from 'moment';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const PostUpdate = ({navigation, user}) => {

    //내용 작성
const [content, setContent] = useState('');

//사진 선택
const [image, setImage] = useState(null);

//X버튼 누를 시 이미지 삭제
const handleRemoveImage = () => {
    setImage(null);
};


const handleContentChange = (text) => {
    setContent(text);
};

  
const handlePostSubmit = async () => {
    // Firestore 컬렉션 레퍼런스를 얻습니다. 'posts'는 Firestore에 저장되는 컬렉션 이름입니다.
    const collectionRef = collection(firestore, 'posts');

    const currentTime = new Date();
  
    const dateTime = moment(currentTime).format('YYYY.MM.DD HH시 mm분');

    // 새로운 문서를 생성하고 데이터를 저장합니다.
    try {
        //내용이 없을 시
        if (!content) {
            alert('내용을 입력해주세요.');
            return;
        }
        
        const postDocRef = await addDoc(collectionRef, {
            uid: user.uid,
            content: content, // 내용
            nickName: user.displayName,
            avatar: user.photoURL,
            imageUrl: image, // 이미지 URL
            dateTime: dateTime, // 생성 시간 (서버 시간 기준)
            likes : 0,
        });
  
        console.log('글이 성공적으로 저장되었습니다.');

        //파이어베이스 postDocRef 가져오기
        const postDocSnap = await getDoc(postDocRef);
        const newPost = { ...postDocSnap.data()};
        
        navigation.navigate('Post');
    
    } catch (error) {
      console.error('글 저장에 실패했습니다.', error);
    }
  };



  //image-picker 라이브러리 사용
  const pickImage = async () => {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {

        const storage = getStorage();
        const imageRef = ref(storage, `post_uploadImg/${user.uid}_${Date.now()}.jpg`);

        // 이미지의 uri를 사용하여 Blob으로 변환
        const response = await fetch(result.uri);
        const blob = await response.blob();

        try {
             //파이어스토리지에 사진 저장
            await uploadBytes(imageRef, blob);

            //업로드한 이미지 다운로드
            const downloadURL = await getDownloadURL(imageRef);

            //다운로드한 이미지 image에 저장
            setImage(downloadURL);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
      }
    };



  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        {/* 상단바 */}
        <View 
            style={{
            width: '100%', 
            backgroundColor: 'white', 
            height: 44, 
            paddingHorizontal: 18,
            borderBottomWidth: 0.5,
            borderBottomColor: '#EAEAEA',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <TouchableOpacity>
                <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
            </TouchableOpacity>

            <Text style={{fontSize: 16}}>
                게시판 글쓰기
            </Text>


            <TouchableOpacity onPress={handlePostSubmit}>

                <Text style={{fontSize: 16}}>
                    등록
                </Text>
            </TouchableOpacity>
        </View>

        {/* 게시판 글작성 컨테이너 */}
        <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={{paddingHorizontal: 18, paddingVertical: 30}}>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChangeText={handleContentChange}
                        multiline

                    />
                </View>

            </TouchableWithoutFeedback>

        </KeyboardAwareScrollView>


        <View style={{height: 90, paddingHorizontal: 18}}>
            {image ? (
                <View style={{flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8}}>
                    <Image style={{backgroundColor: '#EFEFEF', width: 50, height: 50, borderRadius: 10}} source={{ uri: image }}/>
                    <TouchableOpacity onPress={handleRemoveImage}>
                        <Ionic name="close-circle-outline" style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
            )
            :

            (<View style={{height: 50, paddingHorizontal: 20, marginBottom: 8}}></View>)
            }



            {/* 이미지 업로드*/}
            <TouchableOpacity onPress={pickImage}>
                <Ionic name="camera-outline" style={{fontSize:28}} />
            </TouchableOpacity>
        </View>

    </SafeAreaView>
  )
}

export default PostUpdate

const styles = StyleSheet.create({
    contentInput: {
        fontSize: 16,
        textAlignVertical: 'top',
        padding: 8,
    },
    closeIcon: {

        fontSize: 22,
        position: 'absolute',    
        right: -12,
        top: -10,
        color: '#424242'

    },
})