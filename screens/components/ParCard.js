import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import moment from 'moment';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

let dimesion = (Dimensions.get('window').width);

const ImplementCard = ({avatar, name, image, title, location, date, time, content, state, id, scrap}) => {

    // moment 라이브러리를 사용하여 원하는 형식으로 변환
    const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    const formattedDate = moment(jsDate).format('M월 D일');

    // 지역 -> ~구 만 나오게 변환
    const match = location.match(/(\S+구)/);
    const extractedLocation = match ? match[1] : '';

    const [isScrapped, setIsScrapped] = useState(scrap);

    const handleScrap = async () => {
        try {
            const newScrapped = !isScrapped;
            const participantDocRef = doc(firestore, 'participant', id);
            await updateDoc(participantDocRef, { scrap: newScrapped });
            setIsScrapped(newScrapped);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }

     // UseEffect를 이용해 컴포넌트가 마운트될 때 데이터를 가져와 isScrapped 설정
     useEffect(() => {
        const fetchScrappedStatus = async () => {
            try {
                const participantDocRef = doc(firestore, 'participant', id);
                const docSnapshot = await getDoc(participantDocRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setIsScrapped(data.scrap);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchScrappedStatus();
    }, [id]); // id가 변경될 때마다 실행


    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <View>
                    <Image source={{url: image}} style={styles.itemImage}/>
                    <TouchableOpacity onPress={handleScrap}>
                        {isScrapped ? (
                            <Ionic style={styles.icon} name='heart' size={20} color='red'></Ionic>
                        ):(
                            <Ionic style={styles.icon} name='heart-outline' size={20} color='white'></Ionic>
                        )}
                    </TouchableOpacity>
                </View>
            
                <View style={{flexDirection: 'row', marginTop: -18 ,marginVertical: 10,  alignItems: 'center'}}>
                    <Image source={{url: avatar}} style={styles.avatar}></Image>
                    <Text style={styles.name}>{name}</Text>
                </View>

                <Text style={styles.itemTitle}>{title}</Text>
                
                <View style={{flexDirection:'row'}}>
                    <View style={styles.infoBox}>
                        <Ionic name='location-outline' size={10} color='#656565'></Ionic>
                        <Text style={styles.infoText}>{extractedLocation}</Text>   
                    </View>

                    <View style={{marginLeft: 3}}></View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>{formattedDate}</Text>   
                    </View>
                </View>

                <Text>{state}</Text> 

            </View>
        </View>
    )
}

export default ImplementCard

const styles = StyleSheet.create({
    container: {
        marginBottom: 6,
        justifyContent: 'center',
        alignItems: 'left',    
    },
    icon: {
        top: -114,
        left: 137,
    },
    avatar: {
        width: 22,
        height: 22,
        borderRadius: 50,
        marginRight: 6,
      },

    name: {
        fontSize: 14,
        fontWeight: '300',
    },

    itemImage: {
        marginVertical: 18, 
        width: 160,
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
        marginHorizontal: 10, // 가로 간격을 조절하는 마진 값
    },
    
    infoBox:{
        backgroundColor: "#E7E7E7",
        width:58,
        height: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row'
    },

    infoText:{
        color:"#656565",
        fontSize: 13, 
    }

})