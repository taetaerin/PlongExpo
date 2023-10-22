import React, { useEffect, useState } from 'react';
import { Button, Keyboard, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Ionic from 'react-native-vector-icons/Ionicons';
import google from '../googleMap';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import moment from 'moment';
import { getAuth } from 'firebase/auth';



const Map = () => {
  //출발지
  const [origin, setOrigin] = useState(null);
  //목적지
  const [destination, setDestination] = useState(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // 출발지 업데이트 함수
  const updateOrigin = (data, details) => {
    const { geometry } = details;
    if (geometry) {
      const { location } = geometry;
      setOrigin({
        name: data.description,
        latitude: location.lat,
        longitude: location.lng,
      });

      // 출발지가 업데이트되면 지도를 해당 위치로 확대
      setMapRegion((prevRegion) => ({
        ...prevRegion,
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02, 
        longitudeDelta: 0.02, 
      }));
    }
  };

  // 도착지 업데이트 함수
  const updateDestination = (data, details) => {
    const { geometry } = details;
    if (geometry) {
      const { location } = geometry;
      setDestination({
        name: data.description,
        latitude: location.lat,
        longitude: location.lng,
      });
    }
  };

  //모달창 
  const [modalVisible, setModalVisible] = useState(false);

  //칼로리
  const [calories, setCalories] = useState(0);

  //시간
  const [timer, setTimer] = useState(0);

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //시간, 칼로리 계산 함수
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

  //파이어베이스에 날짜, 시간, 칼로리 저장 함수
  const handlePloggingEnd = async () => {
    // 사용자 ID와 현재 날짜 설정
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;

    const currentTime = new Date();
    const dateTime = moment(currentTime).format('YYYY-MM-DD');
    

    // Firestore map 컬랙션
    const collectionRef = collection(firestore, 'map');

    try {
      // 같은 날짜와 사용자에 대한 데이터를 찾아서 가져오기
      const querySnapshot = await getDocs(
        query(collectionRef, where('userId', '==', userId), where('dateTime', '==', dateTime))
      );

      if (querySnapshot.empty) {
        // 같은 날짜의 데이터가 없으면 새로운 문서를 생성
        await addDoc(collectionRef, {
          userId: userId,
          calories: calories,
          timer: timer,
          dateTime: dateTime,
        });

        console.log('새로운 데이터가 성공적으로 저장되었습니다.');
      } else {
        // 같은 날짜의 데이터가 이미 존재하면 그 데이터를 업데이트
        querySnapshot.forEach(async (doc) => {
          const existingData = doc.data();
          const updatedCalories = existingData.calories + calories;
          const updatedTimer = existingData.timer + timer;

          // 문서 업데이트
          await updateDoc(doc.ref, {
            calories: updatedCalories,
            timer: updatedTimer,
          });

          console.log('데이터가 업데이트되었습니다.');
        });
      }
    } catch (error) {
      console.error('데이터 업데이트에 실패했습니다.', error);
    }

    // 누적된 칼로리와 시간 초기화 및 모달 닫기
    setCalories(0);
    setTimer(0);
    setIsTimerRunning(false);
    setModalVisible(false);
  };



  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="출발지를 입력하세요"
              enablePoweredByContainer={false}
              query={{
                key: google.GOOGLE_API_KEY,
                language: 'ko',
              }}
              debounce={400}
              onPress={(data, details) => {
                updateOrigin(data, details);
              }}
              fetchDetails={true}
            />

            <GooglePlacesAutocomplete
              placeholder="도착지를 입력하세요"
              enablePoweredByContainer={false}
              query={{
                key: google.GOOGLE_API_KEY,
                language: 'ko',
              }}
              debounce={400}
              onPress={(data, details) => {
                updateDestination(data, details);
              }}
              fetchDetails={true}
            />
          </View>

        

          <MapView
            style={{ flex: 1 }}
            mapType="mutedStandard"
            region={mapRegion} // 지도의 확대를 조정하기 위해 region 속성을 업데이트
          >
            {origin && destination && (
              <>
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
                  optimizeWaypoints={true}
                  resetOnChange={true}
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
            )}
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

                <View style={{ width: 240, top: 40, flexDirection: 'row', justifyContent: 'space-between'}}>
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

                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 220, marginTop: 35}}>
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

                </View>

                <Pressable
                  style={[styles.buttonClose]}
                  onPress={handlePloggingEnd}>
                    <Ionic  name='walk-outline'size={20} color='white'>
                      <Text style={styles.btn}>플로깅 종료하기</Text>
                    </Ionic>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 20,
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
      marginTop: 12
    },
    modalText: {
      marginTop: 10,
      fontSize: 16,
      textAlign: 'center', 
      color: "#424242",
      opacity: 0.7
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
      marginTop: 12,
      justifyContent: 'center',
    },
     
});

export default Map;


