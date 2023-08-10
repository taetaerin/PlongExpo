import { View, Text, ScrollView,  StyleSheet,SafeAreaView, Modal, Image,  TouchableOpacity, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';


let locationOfInterest = [
  {
    title: "First",
    location: {
      latitude: 37.5,
      longitude: 127
    },
    description: "First Marker"
  },
  {
    title: "Second",
    location: {
      latitude: 36.5,
      longitude: 128
    },
    description: "Second Marker"
  }
]
const Map = () => {
  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    latitude: 37.56,
    longitude: 126.96
  });
  const onRegionChange = (region) => {
    console.log(region);
  };

  const showLocationOfInterest = () => {  
    return locationOfInterest.map((item, index) => {
      return(
        <Marker
        key={index}
        coordinate={item.location}
        title={item.title}
        description={item.description}>

        </Marker>
      )
    });
  };
  return (
    <View>
      <SafeAreaView>
      <MapView 
      style={styles.map}
      onRegionChange={onRegionChange}
      initialRegion={{"latitude": 37.56752936332573, 
                      "latitudeDelta": 0.2084201913482815,
                      "longitude": 126.96330629093407, 
                      "longitudeDelta": 0.14282579253705308}}
                      provider={PROVIDER_GOOGLE}
                      showsUserLocation={true}
      >
        {showLocationOfInterest()}
        <Marker
        draggable
        coordinate={draggableMarkerCoord}
        onDragEnd={(e) => setDraggableMarkerCoord(e.nativeEvent.coordinate)}></Marker>
      
      <Modal>
      <TouchableOpacity>
      <View style={{backgroundColor: '#0BE060', width: 350, height: 50, justifyContent: 'center',
                    alignItems: 'center', alignSelf: 'center', marginTop: 650, borderRadius: 4}}>
       <Text style={styles.btn}>플로깅 시작하기</Text>
       </View>
       </TouchableOpacity>
       </Modal>
       
       
      </MapView>
     
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
  btn: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,

  },
 
})