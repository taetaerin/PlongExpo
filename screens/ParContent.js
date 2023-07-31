import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';

const ParContent = ({route, navigation}) => {
    const {data} = route.params;

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}} >
        <View>
            {/* 상단바 */}
            <View 
                style={{
                width: '100%', 
                backgroundColor: 'white', 
                height: 44, 
                paddingHorizontal: 18,
                flexDirection: 'row',
                justifyContent:'flex-end',
                top: 10}}
                >
                    <TouchableOpacity>
                    <Ionic name= "md-ellipsis-horizontal" size={17} color='#424242' />
                    </TouchableOpacity>
            </View>

            <View>
                <Image source={data.image} style={{width: '100%', height: 240}} />
            </View>

            <View style={styles.wrapper}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.a}>
                    <Text style={styles.situation}>{data.situation}</Text>
                </View>
                <Ionic style={styles.icon} name='person-outline' size={16} color="#424242"> 5</Ionic>
                
                </View>
                <Text style={styles.title}>
                {data.title}
                </Text>
               <View style={{flexDirection: 'row', marginTop: 20 ,marginVertical: 10}}>
                <Image source={data.avatar} style={styles.avatar}></Image>
                <Text style={styles.name}>{data.name}</Text>
               </View>

               <Text style={styles.subtitle}>모임정보</Text>
               <View style={{flexDirection: 'row', marginTop: 10}}>
                <Ionic name='calendar-outline' size={16} color='#424242'></Ionic>
                <Text style={styles.content}>{data.date} </Text>
                <Text style={styles.content}>{data.day} </Text>
                <Text style={styles.content}>{data.time}</Text>
               </View>
               <View style={{flexDirection: 'row', marginTop: 10}}>
               <Ionic name='location-outline' size={16} color='#424242'></Ionic>
                <Text style={styles.content}>{data.where}</Text>
               </View>
               <View style={{marginTop: 10}}>
                <Text style={styles.content}>준비물: {data.meterials}</Text>
                </View>
                <View style={{marginTop: 40}}>
                    <Text style={styles.content}>{data.content}</Text>
                </View>
                <Pressable style={styles.button} onPress={() => {
                    console.log('참여가 완료되었습니다.');
                }}>
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 10}}>참여하기</Text>
                </Pressable>


               
            </View>
        </View>
    </SafeAreaView>
  )
}

export default ParContent;

const styles = StyleSheet.create({
    wrapper : {
        // backgroundColor: 'yellow',
        paddingHorizontal: 18,
    },
    a: {
        backgroundColor: '#54CB52',
        marginTop: 30,
        height: 24,
        width: 83,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    situation: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        
    },
    icon: {
        marginTop: 30
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 12
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginRight: 10,
      },

    name: {
        fontSize: 16,
        fontWeight: '500',
        top: 6
    },
    subtitle: {
        fontSize: 16,
        color: '#41993F',
        fontWeight: 'bold',
        marginTop: 30,
    },

    content: {
        fontSize: 16
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: 455,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#0BE060',

    }
    



  

});
