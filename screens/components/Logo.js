import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const Logo = () => {
  let LogoImg = require('../../assets/images/Logo.png');
  return (
    <View style={styles.logoContainer}>
        {/* 로고 이미지 */}
        <View>
            <Image style={styles.logoImg} source={LogoImg} resizeMode='contain' />
        </View>

        {/* 로고 이미지 밑 텍스트 */}
        <View style={styles.subTitle}>
            <Text>함께 뜻깊은</Text>
            <Text>플로깅 해볼까요?</Text>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent:'center',
        marginTop: '30%',
        marginBottom: '40%',
      },

      logoImg : {
        height: 60,
        width: 180,
      },
      
      subTitle:{
        alignItems: 'center',
        color: '#424242',
      },
});

export default Logo;