import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';

const Content = ({route, navigation}) => {
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
                // alignItems: 'center', 
                paddingHorizontal: 18,
                justifyContent:'center'}}
                >
                    <TouchableOpacity>
                        <Ionic name="chevron-back-sharp" style={{fontSize:24}} onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
            </View>

            <View>
                <Image source={data.image} style={{width: '100%', height: 240}} />
            </View>

            <View style={styles.wrapper}>
                <Text style={styles.title}>
                {data.title}
                </Text>

                <Text style={styles.content}>
                    {data.content}
                </Text>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Content;

const styles = StyleSheet.create({
    wrapper : {
        // backgroundColor: 'yellow',
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 20,
        color: "#48566A",
        marginVertical: 32,
    },
    content: {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 24,
        color: '#424242',
    },
});
