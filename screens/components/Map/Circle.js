import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress, CircularProgress } from 'react-native-circular-progress';
import { Svg } from 'react-native-svg';

const Circle = ({ monthlyCalories }) => {
  return (
    <View style={{ marginTop: 20, alignItems: 'center'}}>
      <Text style={{ fontSize: 18, color: '#424242', marginBottom: 10 }}>이번 달 활동량</Text>
      <View style={styles.progressContainer}>
          <Svg height="150" width="150" style={styles.a}>
            <CircularProgress
              size={120}
              width={15}
              //fill={monthlyCalories} // 월간 칼로리를 최대 칼로리로 나눈 비율로 설정
              fill={monthlyCalories / 10000  * 100}
              tintColor="#0BE060"
              rotation={0} 
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#E4EAF1"
            >
              {(fill) => (
                  <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>

                      <Text style={{ fontSize: 18, color: '#424242'}}>{`${monthlyCalories}`}</Text>
                      <Text style={{ fontSize: 12, color: '#6B6B6B', top: 2 }}> kcal</Text>
                  </View>
              )}
            </CircularProgress>
          </Svg>
      </View>
    </View>
  );
};

export default Circle;


const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    //marginTop: 20,
    justifyContent: 'center',
  },
  progressText: {
    //marginTop: 10,
    fontSize: 18,
    color: '#424242',
  },
  a: {
    justifyContent: 'center',
    alignItems:'center'
  }
});

