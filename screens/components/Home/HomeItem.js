import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';


const HomeItem = ({title, image, subTitle}) => {
  return (
    <View style={{paddingHorizontal: 18, paddingVertical: 4, borderBottomWidth: 0.2, borderColor: '#D9D9D9'}}>
      {/*컨테이너 */}
      <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
              {/* 이미지 컨테이너 */}
              <View style={styles.imageContainer}>
                <Image source={image} style={{width: '80%', height: '80%'}} />
              </View>

              {/* 타이틀, 서브타이틀 컨테이너 */}
              <View style={styles.textContainer}>
                  <View>
                    <Text style={{fontWeight: 400, fontSize: 16, marginBottom: 3}}>{title}</Text>
                    <Text style={{color: '#8C8C8C'}}>{subTitle}</Text>
                  </View>
              </View>
          </View>

          <TouchableOpacity>
              <Ionic name="chevron-forward-outline" style={{fontSize:16, color: '#888888'}} />
          </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default HomeItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems:'center'
  },
  imageContainer: {
    backgroundColor: 'white', 
    width: 60, 
    height: 60, 
    borderRadius: '10%', 
    borderWidth: 0.2, 
    borderColor: "#EEEEEE", 
    justifyContent:'center', 
    alignItems:'center'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginLeft: 10,
  }
})