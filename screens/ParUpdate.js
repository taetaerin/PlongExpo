import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const ParUpdate = ({route, navigation}) => {
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
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}} >
        <View>
            {/* 상단바 */}
            <View 
                 style={{
                    width: '100%', 
                    backgroundColor: 'white', 
                    height: 44, 
                    alignItems: 'center', 
                    paddingHorizontal: 18,
                    justifyContent:'space-between',
                    flexDirection: 'row'}}
                    >
                        <TouchableOpacity>
                            <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.update}>등록</Text>
                        </TouchableOpacity>
                </View>
            
                <TouchableOpacity onPress={pickImage}>
                    <Image style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', height: 146, width: 390}} 
                     source={{ uri:image }}/>
                <Ionic name="camera-outline" style={{fontSize:28, color: 'white',marginTop: -30, left: 347}} />
            </TouchableOpacity>
            <Text>
                
            </Text>
                </View>
                </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    update: {
        fontSize: 16,
        fontWeight: 'bold',
        
    }
})

export default ParUpdate;

             