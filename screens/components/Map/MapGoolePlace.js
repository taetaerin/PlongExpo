import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import google from '../../../googleMap';


const MapGoolePlace = () => {
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


  return (
    <View style={{flex: 1}}>
      {/*출발지, 도착지 컨테이너*/}
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
      
      {/* 지도 경로 */}
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
    </View>
  )
}

export default MapGoolePlace

const styles = StyleSheet.create({
  searchContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
  },
   
});