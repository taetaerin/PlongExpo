import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import moment from 'moment';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const PostEdit = ({navigation, route}) => {
    const { postId } = route.params;

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

    //postId에 해당하는 글, 사진 가져오기
    useEffect(() => {
        const fetchPostData = async () => {
          try {
            const postDocRef = doc(firestore, 'posts', postId);
            const postDocSnap = await getDoc(postDocRef);
            const postData = postDocSnap.data();
    
            if (postData) {
              setContent(postData.content);
              setImage(postData.imageUrl);
            }
          } catch (error) {
            console.error('Error fetching post data:', error);
          }
        };
    
        fetchPostData();
    }, [postId]);

    //수정하기 버튼 - 파이어베이스 업데이트
    const handlePostEdit = async () => {
        try {
          const postDocRef = doc(firestore, 'posts', postId);
    
          //수정한 데이터 업데이트
          await updateDoc(postDocRef, { 
            content: content,
            imageUrl: image,
          });
    
          navigation.goBack();
        } catch (error) {
          console.error('Error updating post:', error);
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
    
    
                <TouchableOpacity onPress={handlePostEdit}>
                    <Text style={{fontSize: 16}}>
                        수정
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
    
export default PostEdit;
    
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