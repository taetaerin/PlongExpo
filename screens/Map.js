import { View, Text, ScrollView,  StyleSheet,SafeAreaView, Alert, Modal, Image, TouchableOpacity, Platform, Pressable } from 'react-native'
import React, { useState, useEffect,useLayoutEffect } from 'react'
import MapView,  {Marker, AnimatedRegion,Polyline,MarkerAnimated, PROVIDER_GOOGLE} from 'react-native-maps';

import Ionic from 'react-native-vector-icons/Ionicons';



// let locationOfInterest = [
//   {
//     title: "First",
//     location: {
//       latitude: 37.5,
//       longitude: 127
//     },
//     description: "First Marker"
//   },
//   {
//     title: "Second",
//     location: {
//       latitude: 36.5,
//       longitude: 128
//     },
//     description: "Second Marker"
//   }
// ]
const Map = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    latitude: 37.5,
    longitude: 127
  });
  const onRegionChange = (region) => {
    console.log(region);
  };

  

  // const showLocationOfInterest = () => {  
  //   return locationOfInterest.map((item, index) => {
  //     return(
  //       <Marker
  //       key={index}
  //       coordinate={item.location}
  //       title={item.title}
  //       description={item.description}>

  //       </Marker>
  //     )
  //   });
  // };

  useLayoutEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation({latitude:location.coords.latitude,longitude:location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,})
    console.log(location);
    })();

  }, []);

  return (
    <View>
      <SafeAreaView>
      <MapView style={styles.map}
      onRegionChange={onRegionChange}
      initialRegion={{
        latitude: 37.50000,
        longitude: 127.00000,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
       provider={PROVIDER_GOOGLE}
       showsUserLocation={true}
       followUserLocation
       loadingEnabled
       region={location}
      >
        <Marker
        //  draggable
        //  coordinate={draggableMarkerCoord}
        //  onDragEnd={(e) => setDraggableMarkerCoord(e.nativeEvent.coordinate)}
        coordinate={{
          latitude: 37.5,
          longitude: 127,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
   </Marker>
       
      </MapView>
      {/* 플로깅 시작/종료 모달창 */}
      <View style={styles.centeredView}>
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
            <View style={{flexDirection: 'row'}}>
            <Text style={styles.modalText}>킬로미터</Text>
            <Text style={styles.modalText}>시간</Text>
            <Text style={styles.modalText}>칼로리</Text>
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
      <Pressable
        style={[styles.buttonStart]}
        onPress={() => setModalVisible(true)}>
        <Ionic  name='walk-outline'size={20} color='white'>
          <Text style={styles.btn}>플로깅 시작하기</Text>
          </Ionic>
      </Pressable>
    </View>
       </SafeAreaView>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  buttonStart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#0BE060', 
    height: 50, 
    width: 356, 
    alignSelf: 'center', 
    borderRadius: 5,
    marginBottom: 140
  },
  btn: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,

  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom:59,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '30%',
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
    marginTop: 100
  },
  
  modalText: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center', 
   
  },
});
  
 
