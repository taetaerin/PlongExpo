import { Modal, SafeAreaView, StyleSheet, View, Text, Button, Pressable} from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import MapView, { Marker, AnimatedRegion,Polyline,MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Ionic from 'react-native-vector-icons/Ionicons';
import google from '../googleMap';


const Map = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);

  //시간
  const [calories, setCalories] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let calorieInterval;
    let timerInterval;

    if (isTimerRunning) {
      calorieInterval = setInterval(() => {
        setCalories((prevCalories) => prevCalories + 1);
      }, 20000);

      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(calorieInterval);
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(calorieInterval);
      clearInterval(timerInterval);
    };
  }, [isTimerRunning]);


  //출발지
  const [origin, setOrigin] = useState(null);

  //도착지
  const [destination, setDestination] = useState(null);

  return (
    <SafeAreaView style={styles.container}>

      {/* 출발지, 도착지 입력컨테이너 */}
      <View style={styles.searchContainer}>

        {/* 출발지 입력 */}
        <GooglePlacesAutocomplete
            placeholder="출발지를 입력하세요"
            enablePoweredByContainer={false}
            query={{
              key: google.GOOGLE_API_KEY,
              language: 'ko',
            }}
            debounce={400}
            onPress={(data, details = null) => {
              const { geometry } = details;
              if (geometry) {
                const { location } = geometry;
                setOrigin({
                  name: data.description,
                  latitude: location.lat,
                  longitude: location.lng,
                });
              }
            }}
            fetchDetails={true}
          />

        {/* 도착지 입력 */}
        <GooglePlacesAutocomplete
          placeholder="도착지를 입력하세요"
          enablePoweredByContainer={false}
          query={{
            key: google.GOOGLE_API_KEY,
            language: 'ko',
          }}
          debounce={400}
          onPress={(data, details = null) => {
            const { geometry } = details;
            if (geometry) {
              const { location } = geometry;
              setDestination({
                name: data.description,
                latitude: location.lat,
                longitude: location.lng,
              });
            }
          }}
          fetchDetails={true}
        />
      </View>

      
      <MapView
          style={{ flex: 1 }}
          mapType="mutedStandard"
          initialRegion={{
            latitude: origin?.latitude || 37.78825, // 출발지 설정되지 않았을 때 기본 값
            longitude: origin?.longitude || -122.4324, // 출발지 설정되지 않았을 때 기본 값
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
      >
         
          {origin && destination ? (
            <>
              {/* 출발지-도착지 도보 경로 */}
              <MapViewDirections
                origin={{
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                }}
                destination={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                apikey={google.GOOGLE_API_KEY}
                strokeWidth={3}
                strokeColor="#0BE060"
                language="ko"
                mode="walking" 
              />

              <Marker
                coordinate={{
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                }}
                title="출발지"
              />

              <Marker
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                title="도착지"
              />
            </>
          ) : null}

        </MapView>

        {/* 시작하기 버튼 컨테이너 */}
        <View style={styles.btnContainer}>
          <Pressable
              style={styles.buttonStart}
              onPress={() => setModalVisible(true)}
          >   
              <View style={{flexDirection: 'row'}}>
                <Ionic  name='walk-outline'size={20} color='white'  />
                <Text style={styles.btnText}>플로깅 시작하기</Text>
              </View>
          </Pressable>
        </View>
        
        {/* 모달창 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View style={{ width: 240, top: 24, flexDirection: 'row', justifyContent: 'space-between'}}>
                {/* 시간 */}
                <View>
                  <Text style={styles.timer}>
                    {formatTime(timer)}
                  </Text>
                </View>

                {/* 칼로리 */}
                <View>
                  <Text style={styles.timer}>{calories} kcal</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 220, marginTop: 18}}>
                <Text style={styles.modalText}>{"       "}시간</Text>
                <Text style={styles.modalText}>{"    "}칼로리</Text>
              </View>
       

              <View style={styles.timerbtn}>
                <Button
                  title="시작"
                  onPress={() => setIsTimerRunning(true)}
                />

                <Button
                  title="중단"
                  onPress={() => setIsTimerRunning(false)}
                />             

                <Button
                  title="리셋"
                  onPress={() => {
                    setCalories(0);
                    setTimer(0);
                  }}
                />

              </View>

              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                  <Ionic  name='walk-outline'size={20} color='white'>
                    <Text style={styles.btn}>플로깅 종료하기</Text>
                  </Ionic>
              </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 55,
    left: 10,
    right: 10,
  },
  btnContainer: {
    zIndex: 1,
    position: 'absolute',
    bottom: -130,
    left: 10,
    right: 10,
  },
  buttonStart: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0BE060', 
    height: 50, 
    width: 356, 
    borderRadius: 5,
    marginBottom: 140,
    alignSelf: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
  },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '27%',
      width: '100%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonClose: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4DA9FF',
      height: 50, 
      width: 356, 
      alignSelf: 'center', 
      borderRadius: 5,
      marginTop: 15
    },
    modalText: {
      marginTop: 10,
      fontSize: 16,
      textAlign: 'center', 
      color: "#424242",
      opacity: '0.7'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom:59,
    },

    timer: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    
    timerbtn: {
      flexDirection: 'row',
      fontSize: 18,
      marginTop: 10,
      justifyContent: 'center',
    },
     
});



