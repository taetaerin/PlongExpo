import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons';
import React from 'react'

let dimesion = (Dimensions.get('window').width);

const ImplementCard = ({avatar, name, image, title, location, date}) => {
  return (
    <View style={styles.container}>
        <View style={styles.item}>
            <View>
            <Image source={image} style={styles.itemImage}/>
            <Ionic style={styles.icon} name='heart-outline' size={20} color='#424242'></Ionic>
            </View>
            
            <View style={{flexDirection: 'row', marginTop: -10 ,marginVertical: 10}}>
            <Image source={avatar} style={styles.avatar}></Image>
            <Text style={styles.name}>{name}</Text>
            </View>

            <Text style={styles.itemTitle}>{title}</Text>
            
            <View style={{flexDirection:'row'}}>
            <View style={styles.a}>
                <Ionic name='location-outline' size={10} color='#656565'></Ionic>
             <Text style={styles.b}>{location}</Text>   
            </View>
            <View style={{marginLeft: 3}}></View>
            <View style={styles.a}>
             <Text style={styles.b}>{date}</Text>   
            </View>
            </View>
            <Text style={styles.b}>모집중</Text>
        </View>
    </View>
  )
}

export default ImplementCard

const styles = StyleSheet.create({
    container: {
        marginBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    icon: {
        top: -114,
        left: 140,
        

    },
    avatar: {
        width: 19,
        height: 19,
        borderRadius: 50,
        marginRight: 10,
      },

    name: {
        fontSize: 13,
        fontWeight: '300'

    },

    itemImage: {
        marginVertical: 18, 
        width: 165,
        height: 109,
        borderRadius: 5,
        marginBottom: 10,
        
    },

    itemTitle: {
        fontSize: 16,
        color: "#424242",
        fontWeight: 'bold',
        marginBottom: 10,
        
    },

    item:{
        width: Platform.OS === 'ios' ? (dimesion / 2) - 30: (dimesion / 2) - 40,
        marginBottom: 5,
        alignItems: 'left',
        
        
    },
    
    a:{
        backgroundColor: "#E7E7E7",
        width:58,
        height: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row'
    },

    b:{
        color:"#656565",
        fontSize: 13, 
    }

})