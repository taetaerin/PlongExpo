import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import ImplementCard from "./components/Participant/ParCard";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

import { firestore } from "../firebase";

const Participant = ({ navigation }) => {
  const [participant, setParticipant] = useState([]);
  //console.log(participant)
  const [activeTab, setActiveTab] = useState("모집중");

  // 참여하기 데이터 가져오기 - 원래용
  // const fetchParticipant = async () => {
  //   try {
  //     const participantCollectionRef = collection(firestore, "participant");
  //     onSnapshot(participantCollectionRef, (querySnapshot) => {
  //       const fetchParticipant = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

        
  //       fetchParticipant.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  //       setParticipant(fetchParticipant);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // };


  //바꾼거
  
  //ㅗㅗ
  // const fetchParticipant = async () => {
  //   try {
  //     const currentDate = new Date(); // 현재 날짜를 UTC+0로 가져옴
  //     const utcOffset = 9 * 60; // UTC+9의 offset (분 단위)
  
  //     const participantCollectionRef = collection(firestore, "participant");
  //     onSnapshot(participantCollectionRef, (querySnapshot) => {
  //       const fetchParticipant = querySnapshot.docs.map((doc) => {
  //         const participantData = {
  //           id: doc.id,
  //           ...doc.data(),
  //         };
  //         // 문자열을 Date 객체로 변환 후 UTC+9 타임존으로 변환
  //         const dataDate = new Date(participantData.date.seconds * 1000 + participantData.date.nanoseconds / 1000000);

  //         // 현재 날짜와 비교하여 모집완료로 상태를 변경
  //         if (dataDate < currentDate) {
  //           participantData.state = "모집완료";
  //           const participantDocRef = doc(firestore, "participant", participantData.id); // 수정된 부분
  //           console.log(participantDocRef)
            
  //         }
  //         //console.log(dataDateTimeInUTC9, currentDateTimeInUTC9)
  //         return participantData;
  //       });
  //       fetchParticipant.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  //       setParticipant(fetchParticipant);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // };
  

  const fetchParticipant = async () => {
    try {
      const participantCollectionRef = collection(firestore, "participant");
      onSnapshot(participantCollectionRef, (querySnapshot) => {
        const fetchParticipant = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const currentDate = new Date(); // 현재 날짜 및 시간 가져오기
  
        // 데이터 가져오고 나서 처리
        fetchParticipant.forEach(async (participantData) => {
          // 파이어베이스의 Timestamp 형식을 JavaScript Date로 변환
          const dataDate = new Date(participantData.date.seconds * 1000 + participantData.date.nanoseconds / 1000000);
          //console.log(dataDate, currentDate)
          if (dataDate < currentDate) {
            if (participantData.state === "모집중") {
              // 모집중 상태인 경우 모집완료로 변경
              const participantDocRef = doc(participantCollectionRef, participantData.id);
              await updateDoc(participantDocRef, {
                state: "모집완료",
              });
            }
          }
        });
  
        fetchParticipant.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
        setParticipant(fetchParticipant);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  


  useLayoutEffect(() => {
    fetchParticipant();
  }, []);

  //모집중, 모집완료, 스크랩 기능
  const filteredParticipant = participant.filter((data) => {
    if (activeTab === "모집중") {
      return data.state === "모집중";
    } else if (activeTab === "모집완료") {
      return data.state === "모집완료";
    } else if (activeTab === "스크랩") {
      return data.scrap === true;
    }
    return false;
  });

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      {/* 상단바 */}
      <View 
        style={{
            width: '100%', 
            height: 44, 
            alignItems: 'center', 
            justifyContent:'center',
          }}>
        <View style={styles.parContainer}>
          <Text style={styles.title}>모집글</Text>
          <View style={{ position: 'absolute', right: -145 }}>
            <TouchableOpacity onPress={() => navigation.navigate("ParUpdate")}>
              <Ionic name="md-add" size={26} color="#424242"></Ionic>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* 모집중 모집완료 스크랩 */}
      <View style={{ flexDirection: "row", marginTop: 30, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setActiveTab("모집중")}>
          <Text
            style={[
              styles.subtitle,
              { color: activeTab === "모집중" ? "#48566A" : "#A8A8A8" },
            ]}
          >
            모집중
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("모집완료")}>
          <Text
            style={[
              styles.subtitle,
              { color: activeTab === "모집완료" ? "#48566A" : "#A8A8A8" },
            ]}
          >
            모집완료
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("스크랩")}>
          <Text
            style={[
              styles.subtitle,
              { color: activeTab === "스크랩" ? "#48566A" : "#A8A8A8" },
            ]}
          >
            스크랩
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
          {filteredParticipant.map((data, index) => {
            return (
              <TouchableOpacity
                key={data.id}
                onPress={() => navigation.navigate("ParContent", { data })}
              >
                <ImplementCard
                  id={data.id}
                  avatar={data.avatar}
                  name={data.nickName}
                  title={data.title}
                  content={data.content}
                  image={data.imageUrl}
                  location={data.location}
                  date={data.date}
                  openText={data.openText}
                  state={data.state}
                  key={data.id}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* <View style={{height: 100}} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems:'center',
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    color: "#48566A",
  },
  subtitle: {
    fontSize: 17,
    color: "#868686",
    marginLeft: 18,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default Participant;
