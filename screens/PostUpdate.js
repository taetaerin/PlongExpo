import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

const PostUpdate = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };


  const handleContentChange = (text) => {
    setContent(text);
  };

  const handlePostSubmit = () => {
    // 작성된 글을 서버에 전송하거나 다른 처리를 수행합니다.
    // 예를 들어, 파이어베이스나 API를 이용하여 저장하거나 업로드할 수 있습니다.
    console.log('Title:', title);
    console.log('Content:', content);

    // 작성 완료 후 글 작성 페이지를 닫을 수 있습니다.
    // 이 부분은 각자의 페이지 이동 로직에 맞게 수정해주세요.
    // 예를 들어, React Navigation을 사용하신다면 navigation.goBack()을 호출하면 됩니다.
  };

  //사진 선택
  const [image, setImage] = useState(null);

  //저장 함수
  const onPressSaveEdit = () => {

  };

  const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
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

            <TouchableOpacity>
                <Text style={{fontSize: 16}}>
                    등록
                </Text>
            </TouchableOpacity>
        </View>

        {/* 게시판 글작성 컨테이너 */}
        <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={{backgroundColor: 'green', paddingHorizontal: 18, paddingVertical: 30}}>
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

        <View style={{backgroundColor: 'red', height: 90, paddingHorizontal: 18}}>
            
            {image ? (
                <View style={{flexDirection: 'row', backgroundColor: 'yellow', paddingHorizontal: 20, marginBottom: 8}}>
                    <Image style={{backgroundColor: '#EFEFEF', width: 50, height: 50, borderRadius: 10}} source={{ uri: image }}/>
                    <TouchableOpacity onPress={handleRemoveImage}>
                        <Ionic name="close-circle-outline" style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
            )
            :
            (
                <View style={{backgroundColor: 'yellow', height: 50, paddingHorizontal: 20, marginBottom: 8}}>
                </View>
            )}


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
        fontSize: 24,
        position: 'absolute',    
        right: -14,
        top: -10,
    },
})