import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImplementCard from './components/Home/HomeCard'; 
import ImplementCard2 from './components/Home/HomeCard';
import HomeItem from './components/Home/HomeItem';

const environmentalPractice = [
  {
    id: 1,
    image: require('../assets/images/toothbrush.png'),
    title: '대나무 칫솔 사용하기',
    content : '우리가 주로 사용하는 플라스틱 칫솔은 재활용이 되지 않기 때문에 일반 쓰레기로 분류됩니다. 통계에 따르면 연간 4300톤에 달하는 칫솔이 버려지는 것으로 추정된다고 하는데요. 그럼 대나무 칫솔은 과연 어떨까요? 대나무 칫솔도 마찬가지로 재활용이 안되기 때문에 일반 쓰레기로 분류됩니다. 다만 소각되는 과정에서 앞선 플라스틱 칫솔에 비해 덜 부정적인 영향을 끼칩니다. 만약 쓰레기가 땅에 묻히게 된다면 대나무 칫솔은 칫솔모를 제외하고는 모두 썩는다는 점이 플라스틱과의 차이점입니다. 그러나 플라스틱은 500년이 지나도 썩지 않습니다. 우리 모두 대나무 칫솔을 사용해 보는 것은 어떨까요?'
  },
  {
    id: 2,
    image: require('../assets/images/bag.png'),
    title: '장바구니 사용하기',
    content: '편의점에서 가볍고 싼 가격에 어디서든 볼 수 있는 비닐봉지, 특히 우리나라에서 비닐봉지 사용량이 많은 편인데요. 1회용 비닐봉지 연간 사용량은 약 211억 개로 추정되고 있습니다. 이러한 비닐봉지는 단 25분만 사용되고 버려지고 있으며 버려진 비닐봉지는 소각 시 다이옥신과 같은 심각한 오염물질이 발생하여 매립하여도 분해되기까지 약 500년에서 최대1000년의 시간이 소요되게 됩니다. 우리나라에서도 2019년 1월1일부터 자원재활용법에 따라 대형마트와 백화점, 복합상가 등에서 일회용 비닐봉지 사용을 금지하고 있습니다. 우리나라뿐만 아니라 지구 전체를 지키기 위해 한 명 한 명의 실천이 필요합니다. 우리 모두 비닐봉지 대신 예쁜 에코백을 들어보는 것은 어떨까요?'
  },
  {
    id: 3,
    image: require('../assets/images/coach.png'),
    title: '대중교통 이용하기',
    content: '온실가스란 지구의 온도를 높여 온실처럼 만드는 효과를 가진 기체를 말합니다. 이러한 온실가스 중 가장 큰 비중을 차지하는 것이 바로 이산화탄소입니다. 이산화탄소를 가장 쉽고 효과적으로 줄일 수 있는 방법 중 하나가 자가용을 덜 타고 대중교통을 이용하는 것입니다. 도시의 대기오염 배출원인 1위는 노후 경유 차량입니다.  노후 경유차에서 배출하는 미세먼지가 스모그로 이어지면서 사람의 건강을 해치고 지구를 파괴합니다. 노후 경유차는 친환경 전기차로 바꾸고, 가까운 거리는 도보로, 혼자 이동할 때는 자가용 보다는 대중교통을 이용하는 것이 좋습니다. 더 나은 삶을 위해 대중교통 이용으로 지구온도를 낮춰주세요.'
  },
  {
    id: 4,
    image: require('../assets/images/bath.png'),
    title: '욕실에서의 작은 실천',
    content: '우리는 매일 쓰는 화장실에서 생각보다 엄청난 양의 물을 사용하고 있습니다. 물을 절약하기 위해서는 양치할 때는 양치컵을 사용하고, 세수할 때는 수도꼭지를 틀어 놓은 채 하지 않습니다. 가능하다면 샤워 시간을 줄이는 것도 좋은 방법입니다. 샤워시간을 1분만 줄여도 12L의 물을 절약할 수 있습니다. 또한 물을 채운 물병을 변기수조에 넣으면, 변기를 내릴 때 물 사용량을 줄일 수 있습니다. 우리나라도 지금과 같은 환경오염이 지속된다면 물 부족 국가가 될 수 있습니다. 개인의 노력으로 모두가 물을 절약하고 깨끗이 쓰기위해 일상에서부터 작은 실천을 해 나간다면 물 부족 현상을 분명 극복할 수 있을 것입니다.'
  },
];


const environmentalStory = [
  {
    id: 1,
    image: require('../assets/images/bins.png'),
    title: '분리배출 잘하기',
    subTitle: '내용 삽입',
    content: '배출 시 꼼꼼한 분리배출은 사회적 비용도 절감하고 우리모두를 깨끗한 환경에서 살 수 있게 합니다. \n플라스틱류: 페트병과 플라스틱 용기에 든 내용물은 깨끗이 비우고 부착상표와 뚜껑 등 다른 재질로 된 부분은 제거해주세요.\n비닐류: 과자, 라면봉지, 1회용 비닐봉투에 음식물과 이물질이 묻었다면 물로 2~3번 헹궈 잔여물을 없애고 버리고, 이물질 제거가 어려운 경우에는 종량제봉투에 배출하면 됩니다.\n유리병류: 탄산음료병이나 맥주병, 소주병은 담배꽁초와 같은 이물질을 넣지 말고 버려주세요.하지만 거울, 깨진 유리, 도자기류,유리 식기류는 유리병류가 아니기 때문에 종량제봉투나 전용 마대에 버려주세요.'
  },
  {
    id: 2,
    image: require('../assets/images/hands.png'),
    title: '중고거래',
    subTitle: '내용 삽입',
    content: '국내 중고거래 시장 규모가 나날이 성장하고 있습니다. 이러한 소비의 변화는 필요없는 물건을 누군가가 재사용하게 되면서 자원순환이 일어나 환경적으로 아주 의미가 있습니다. 제품을 만드는데 사용되는 자원은 단순히 노동력과 원재료뿐 만 아니라 에너지와 천연자원도 포함됩니다. 결국 자원을 재활용하는 것은 불필요한 에너지와 천연자원을 아낄 수 있다는 의미입니다. 실제로 중고거래 앱 사용자들이 자원 재사용을 통해 얻은 자원순환효과는 5240만 그루의 소나무를 심은 것과 같고 723톤의 온실가스 저감효과를 냈다고 발표했습니다. 이처럼 중고거래는 자원 재활용을 통한 환경보호에 중요한 영향을 끼치고 있습니다.'
  },
  {
    id: 3,
    image: require('../assets/images/meal.png'),
    title: '육식 줄이고 채식 많이',
    subTitle: '내용 삽입',
    content : '증가하고 있는 육식, 즉 공장식 축산은 기후변화에서부터 산불, 인권침해에 이르기까지 전 세계환경에 파괴적인 영향을 미칩니다. 육류 및 유제품 섭취량을 급격히 줄이지 않는다면 기후위기는 막을 수 없게되고 심할 경우 인류의 생존에도 위협이 될 수 있습니다. 증가하는 육식 소비만큼 지구환경도 점점 악화되고 있습니다. 그렇지만 채식은 기후위기의 시대를 살아가는 현대인들이 일상생활에서 실천할 수 있는 가장 효과적인 기후 대응 행동입니다. 새로운 식습관을 갖는 것은 쉽지만은 않겠지만 하루에 한번이라도 도전해보는 것이 좋겠습니다.'
  },
  {
    id: 4,
    image: require('../assets/images/socket.png'),
    title: '미 사용시 코드 빼기',
    subTitle: '내용 삽입',
    content: '가전제품과 같은 전기용품의 플러그는 꽂아만 둬도 전기가 흘러 에너지를 낭비하게됩니다. 대기상태에서도 전기용품은 전기를 조금씩 사용하고 있습니다. 즉 전자제품의 전원을 끈 상태에서도 기기의 동작과 관계없이 의식하지 않는 사이에 소모되는 전기에너지가 있습니다. 이를 대기전력이라고 하는데 이러한 대기전력의 절감 및 에너지 절약을 실천하기 위해 가장 쉬운 쓰지 않는 플러그를 뽑는 것이 중요합니다.  TV, 에어컨, 전기밥솥, 세탁기 등 사용하지 않는 제품의 플러그를 뽑으면 하루 2800톤의 온실가스가 감축되고, 한 달 1kg의 이산화탄소가 감소하여 한 가구당 연간 50그루의 나무를 심는 것과 같습니다. 우리가 전기를 줄이면 자원의 고갈과 환경오염을 막을 수 있습니다.'
  },
];


const Home = ({navigation}) => {
  let jejuImg = require('../assets/images/plogging.jpeg');
  let logo = require('../assets/images/Logo.png'); 
  
  return (
    <SafeAreaView style={{backgroundColor: 'white', whiteSpace: 'pre-line'}}>
      <View 
        style={{
          width: '100%', 
          height: 44, 
          alignItems: 'center', 
          justifyContent:'center'}}
        >
          <Image source={logo} style={{width: 100, height: 20,top: -6, resizeMode: 'contain'}} />
      </View>
      
      <ScrollView style={{backgroundColor: '#F8F8F8'}}>
  
        <View style={{top: 0, width: '100%', height: 225}}>
          <Image source={jejuImg} style={styles.image} />
        </View>

        <Text style={styles.subTitle}>지구를 지키는 작은 실천</Text>
        <View style={styles.container}>
          {environmentalPractice.map((data) => {
            return(
              <TouchableOpacity onPress={() => navigation.navigate('Content', {data})} key={data.id}>
                <ImplementCard title={data.title} image={data.image} />
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={styles.subTitle}>환경이야기 보따리</Text>
        <View>
          {environmentalStory.map((data, index) => {
            return(
              <TouchableOpacity onPress={() => navigation.navigate('Content', {data})} key={index}>
                <HomeItem title={data.title} image={data.image} subTitle={data.subTitle} />
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{height: 18}}/>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  subTitle: {
    color: "#48566A",
    fontSize: 20,
    fontWeight: 500,
    marginVertical: 13,
    paddingHorizontal: 18,
  },
  container: {
    flexDirection: 'row',
    justifyContent: "space-around",
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
});

export default Home;


