import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Alert,
  ActionSheetIOS,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionic from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase";
import { useIsFocused } from "@react-navigation/native";

const ParContent = ({ route, navigation }) => {
  const { data } = route.params;
  const [isParticipation, setIsParticipation] = useState(false);

  //참여하기 버튼
  const [parComplete, setParComplete] = useState(false);

  //참가자 수
  const [participantCount, setParticipantCount] = useState(0);

  //현재 사용자
  const [currentUser, setCurrentUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // 요일 이름을 가져오는 함수
  const getDayName = (dayNumber) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[dayNumber];
  };

  // Firestore에서 가져온 timestamp 형식을 JS Date 객체로 변환
  const jsDate = new Date(
    data.date.seconds * 1000 + data.date.nanoseconds / 1000000
  );
  // 원하는 날짜 형식으로 포맷팅
  const formattedDate = `${
    jsDate.getMonth() + 1
  }월 ${jsDate.getDate()}일 ${getDayName(jsDate.getDay())}요일`;

  // 시간 포맷팅
  const formattedTime = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(jsDate);

  //더보기 아이콘 눌렀을때
  const isCurrentUserAuthor = currentUser && currentUser.uid === data.uid;

  const handleAction = async () => {
    if (isCurrentUserAuthor) {
      // 로그인한 사용자가 글 작성자인 경우
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["모집완료", "삭제하기", "취소"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // '모집완료' 선택 시 동작
            await handleComplete();
          } else if (buttonIndex === 1) {
            // '삭제하기' 선택 시 동작
            await handleDelete();
          }
        }
      );
    } else {
      // 로그인한 사용자가 글 작성자가 아닌 경우
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["신고하기", "취소"],
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // '신고하기' 선택 시 동작
            Alert.alert("해당 게시물이 신고되었습니다");
          }
        }
      );
    }
  };

  //수정 - 모집완료
  const handleComplete = async () => {
    try {
      // 게시물을 수정하기 위해 게시물 문서의 레퍼런스를 가져오기
      const participantDocRef = doc(firestore, "participant", data.id);

      // 게시물 문서를 업데이트하여 state 값을 '모집완료'로 변경
      await updateDoc(participantDocRef, {
        state: "모집완료",
      });

      Alert.alert("모집이 완료되었습니다.");
      navigation.navigate("Participant");
    } catch (error) {
      console.error("모집 완료 중 오류가 발생했습니다:", error);
    }
  };

  //참여하기 삭제하기
  const handleDelete = async () => {
    try {
      // 게시물을 삭제하기 위해 게시물 문서의 레퍼런스를 가져오기
      const participantDocRef = doc(firestore, "participant", data.id);

      // 게시물 문서를 삭제
      await deleteDoc(participantDocRef);
      navigation.navigate("Participant");
    } catch (error) {
      console.error("게시물 삭제 중 오류가 발생했습니다:", error);
    }
  };

  const isFocused = useIsFocused();

  // 데이터 초기화를 위한 useEffect
  useEffect(() => {
    if (isFocused) {
      setParticipantCount(data.participantsUserId?.length || 0);
      setParComplete(
        data.participantsUserId?.includes(currentUser?.uid) || false
      );
    }
  }, [isFocused, data.participantsUserId, currentUser?.uid]);

  const toggleParticipation = async () => {
    try {
      const participantDocRef = doc(firestore, "participant", data.id);
      const participantDocSnapshot = await getDoc(participantDocRef);

      if (participantDocSnapshot.exists()) {
        const participantsUserId =
          participantDocSnapshot.data().participantsUserId || [];
        const updatedParticipants = new Set(participantsUserId);

        const isCurrentUserParticipating = updatedParticipants.has(
          currentUser.uid
        );

        if (isCurrentUserParticipating) {
          // 참여를 취소한 경우
          updatedParticipants.delete(currentUser.uid);
        } else {
          // 참여한 경우
          updatedParticipants.add(currentUser.uid);
        }

        await updateDoc(participantDocRef, {
          participantsUserId: Array.from(updatedParticipants),
        });
        setParticipantCount(updatedParticipants.size);
        setIsParticipation(!isCurrentUserParticipating); // 참여 상태 업데이트

        // 상태 업데이트 후에만 setParComplete 업데이트
        setParComplete(updatedParticipants.has(currentUser.uid));
      }
    } catch (error) {
      console.error("참여 상태 변경 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "white" }}>
        {/* 상단바 */}
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            height: 44,
            alignItems: "center",
            paddingHorizontal: 18,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* 뒤로가기  */}
          <TouchableOpacity>
            <Ionic
              name="chevron-back-sharp"
              style={{ fontSize: 24 }}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>

          {/* 점 세개 */}
          <TouchableOpacity onPress={handleAction}>
            <Ionic name="md-ellipsis-horizontal" size={17} color="#424242" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View>
            <Image
              source={{ url: data.imageUrl }}
              style={{ width: "100%", height: 240 }}
            />
          </View>

          <View style={styles.wrapper}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.a}>
                <Text style={styles.situation}>{data.state}</Text>
              </View>

              {/* 사람 아이콘 */}
              <Ionic
                style={styles.icon}
                name="person-outline"
                size={16}
                color="#424242"
              >
                {" "}
                {participantCount}
              </Ionic>
            </View>

            <Text style={styles.title}>{data.title}</Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginVertical: 10,
              }}
            >
              <Image
                source={{ url: data.avatar }}
                style={styles.avatar}
              ></Image>
              <Text style={styles.name}>{data.nickName}</Text>
            </View>

            <Text style={styles.subtitle}>모임정보</Text>

            {/* 요일정보 */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              {/* 달력 아이콘 */}
              <Ionic name="calendar-outline" size={18} color="#424242"></Ionic>
              <Text style={styles.content}> {formattedDate}</Text>
              <Text style={styles.content}> {formattedTime}</Text>
            </View>

            {/* 위치정보 */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              {/* 위치 아이콘 */}
              <Ionic name="location-outline" size={18} color="#424242"></Ionic>
              <Text style={styles.content}> {data.location}</Text>
              <Text style={styles.content}> {data.locationOther}</Text>
            </View>

            {/* 준비물정보 */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Ionic
                name="chatbubble-ellipses-outline"
                size={18}
                color="#424242"
              ></Ionic>
              <Text style={styles.content}> 오픈채팅 : {data.openText}</Text>
            </View>

            <View style={{ marginTop: 40 }}>
              <Text style={styles.contentLetter}>{data.content}</Text>
            </View>

            <View style={{ marginBottom: 165 }}></View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 참여하기 버튼 */}
      {parComplete ? (
        <Pressable
          style={[styles.button, { backgroundColor: "#CBCBCB" }]}
          onPress={async () => {
            await toggleParticipation();
            Alert.alert("참여가 취소되었습니다.");
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            참여취소
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.btn, { backgroundColor: "#0BE060" }]}
          onPress={async () => {
            await toggleParticipation();
            Alert.alert("참여가 완료되었습니다.");
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            참여하기
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ParContent;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
  },
  a: {
    backgroundColor: "#54CB52",
    marginTop: 30,
    height: 24,
    width: 83,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  situation: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    marginTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
    top: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#41993F",
    fontWeight: "bold",
    marginTop: 30,
  },

  content: {
    fontSize: 16,
  },
  contentLetter: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0BE060",
  },
  btn: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CBCBCB",
  },
});
