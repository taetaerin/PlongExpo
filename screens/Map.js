import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import MapGoolePlace from './components/Map/MapGoolePlace';
import MapModal from './components/Map/MapModal';

const Map = () => {
  return (
    <View style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <MapGoolePlace />
          <MapModal />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};



export default Map;


