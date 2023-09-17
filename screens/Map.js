


import { Modal, SafeAreaView, StyleSheet, View, Text, Button, Pressable} from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import MapView, { Marker, AnimatedRegion,Polyline,MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Ionic from 'react-native-vector-icons/Ionicons';
import google from './googleMap';


const Map = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0); // 누적 거리
  
  //지도위치 받아오기
  const onRegionChange = (region) => {
    console.log(region);
  };

    //타이머
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [customInterval, setCustomInterval] = useState();

  const startTimer = () => {
      setCustomInterval(
          setInterval(() => {
              changeTime();
          }, 1000)
      )
  }

  const stopTimer = () => {
      if (customInterval) {
          clearInterval(customInterval)
      }
  }

  const clear = () => {
    stopTimer();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  }

  const changeTime = () => {
      setSeconds((prevState) => {
          if (prevState + 1 === 60) {
              setMinutes((prevMinutes) => {
                if (prevMinutes + 1 === 60) {
                  setHours((prevHours) => prevHours + 1);
                }
              });
              return 0;
          }
          
          return prevState + 1;
      })
  };
  //칼로리
  // const [kcal, setKcal] = useState(0); 
  const [kcalo, setKcalo] = useState(0);
  const startKcal = () => {
    setCustomInterval(
    setInterval(() => {
        changeKcal();
    }, 20000)
    )
  }
  const stopKcal = () => {
    if (customInterval) {
      clearInterval(customInterval)
  }
  }
  const clearKcal = () => {
    stopKcal();
    setKcalo(0);
  }
  const changeKcal = () => {
    setKcalo((prevState) => {
    return prevState + 1;
     
    })
  };


  //출발지
  const [origin, setOrigin] = useState(null);

  //도착지
  const [destination, setDestination] = useState(null);

  componentDidMount = () => {

    // 실시간으로 위치 변화 감지
    Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, timeInterval: 300, distanceInterval: 1 },
      position => {
        const { coordinate, routeCoordinates, distanceTravelled,kcal } =   this.state;
        const { latitude, longitude } = position.coords;
        
        //새롭게 이동된 좌표
        const newCoordinate = {
          latitude,
          longitude
        };
        
        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
           }

         } else {
           coordinate.timing(newCoordinate).start();
         }
         
         // 좌표값 갱신하기
        //  this.setState({
        //    latitude,
        //    longitude,
        //    routeCoordinates: routeCoordinates.concat([newCoordinate]), //이동경로
        //    distanceTravelled:distanceTravelled + this.calcDistance(newCoordinate), // 이동거리
        //    kcal:this.calcKcal(distanceTravelled), //칼로리 계산
        //    prevLatLng: newCoordinate
        //  });
      }
    );
  
  }
  
  // calcDistance = newLatLng => { //거리 계산
  //   const { prevLatLng } = this.state;
  //   return haversine(prevLatLng, newLatLng) || 0;
  // };
  // calcKcal = distanceDelta=>{
  //   // 이동한 거리를 이용해 kcal 계산해주는 함수. 0.1m당 7kcal로 계산함.
  //   return distanceDelta/0.1 * 7;
  // }

  // 내 현재 위치 중심으로 지도보여줌
  useLayoutEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation({latitude:location.coords.latitude,longitude:location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.008,})
    console.log(location);
    })();

  }, []);

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
 
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
          // mapType="mutedStandard"
          onRegionChange={onRegionChange}
          initialRegion={{
            latitude: origin?.latitude || 37.5, // 출발지 설정되지 않았을 때 기본 값
            longitude: origin?.longitude || 127.0, // 출발지 설정되지 않았을 때 기본 값
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
       showsUserLocation
       followUserLocation
       loadingEnabled
       region={location}
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
          }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            


            <View style={{ width: 250, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', right: 18, top: 35}}>
                {/* 칼로리 컨테이터 */}
                {/* <View>
                    <Text style={styles.timer}>{distanceTravelled} km</Text>
                </View>
                <Text style={styles.l}>|</Text> */}
                <View>
                    <Text style={styles.timer}>
                        {hours < 10 ? "0" + hours : hours} : {minutes < 10 ? "0" + minutes : minutes} : {seconds < 10 ? "0" + seconds : seconds} 
                    </Text>
                </View>
                {/* <Text style={styles.l}>|</Text> */}
                <View>
                    <Text style={styles.timer}>{kcalo} kcal</Text>
                </View>
                </View>
                <View style={{flexDirection: 'row',  justifyContent: 'space-between', width: 200, marginTop: 10}}>
                {/* <Text style={styles.modalText}>킬로미터</Text> */}
                <Text style={styles.modalText}>시간</Text>
                <Text style={styles.modalText}>칼로리</Text>
            </View>

                    <View style={styles.timerbtn}>
                    <Button style={styles.startbtn} title="시작" onPress={() => {
                      startTimer();
                      startKcal();
                    }}></Button>
                    <Button style={styles.stopbtn} title="중단" onPress={() => {
                      stopTimer();
                      stopKcal();
                    }}></Button>
                      {/* <Button title="Clear" onPress={clear}></Button> */}
                    </View>

            <Pressable
              style={[styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}onPressIn={() =>
              {clear(); 
              clearKcal();}}>
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
      marginTop: 30,
      fontSize: 18,
      textAlign: 'center', 
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom:59,
    },

      timer: {
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold'
      },
      timerbtn: {
        flexDirection: 'row',
        fontSize: 18,
        marginTop: 10
      },
     
      l: {
        color: '#D9D9D9',
        fontSize: 30
      }
});
