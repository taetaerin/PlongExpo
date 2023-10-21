import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import kakao from '../../../kakao';

const LocationSearchScreen = ({onLocationChange}) => {
  const [address, setAddress] = useState('');


  const handleSearch = async () => {
    const query = encodeURIComponent(address);
    const apiKey = kakao.KAKAO_API_KEY; // 여기에 발급받은 카카오맵 API 키를 넣으세요
    const apiUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      });

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const firstResult = data.documents[0];
        const resultAddress = firstResult.address_name;
        setAddress(resultAddress);
        onLocationChange(resultAddress);
      } else {
        setAddress('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
            <TextInput
                style={styles.input}
                placeholder="장소명을 입력하세요."
                value={address}
                onChangeText={setAddress}
                placeholderTextColor={'#7F7F7F'}
            >
            </TextInput>
            <Button title="검색" onPress={handleSearch} />
        </View>

        
    </View>

  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginLeft: 10,
    width: 260,
    borderWidth: 1,
    padding: 10,
    borderColor: '#C3C3C3',
    borderRadius: 5
  },
  others: {
    marginLeft: 10,
    flex: 1,
    height: 40,
    width: 300,  
    borderWidth: 1,
    padding: 10,
    borderColor: '#C3C3C3',
    borderRadius: 5,
    marginTop: 10
  },
});

export default LocationSearchScreen;
