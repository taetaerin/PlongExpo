import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'

let dimesion = (Dimensions.get('window').width);

const ImplementCard = ({image, title}) => {
  return (
    <View style={styles.container}>
        <View style={styles.item}>
            <View style={styles.itemImage} >
                <Image source={image} style={styles.image} />
            </View>
            <Text style={styles.itemTitle}>{title}</Text>
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

    itemImage: {
        width: 160,
        height: 140,
        borderRadius: 2,
        marginBottom: 4,
        borderWidth: 0.2,
        borderColor: "#EEEEEE",
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    itemTitle: {
        fontSize: 16,
        color: "#424242",
    },

    item:{
        width: Platform.OS === 'ios' ? (dimesion / 2) - 30: (dimesion / 2) - 40,
        marginBottom: 5,
        alignItems: 'center',
    },
})