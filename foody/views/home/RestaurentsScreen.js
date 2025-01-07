import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, BackHandler } from 'react-native'
import React, {useState, useCallback} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Searchbar, Chip, IconButton, MD2Colors, Avatar, Badge, DefaultTheme } from 'react-native-paper';
import axios from 'axios'
import { useToast } from 'react-native-toast-notifications';
import { useRoute, useFocusEffect, StackActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { API, HOST } from './../../configs';
import { cartTotalSelector } from "./../../redux/selector";
import { addToCart } from './../../redux/features/CartSlice'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#659349',
  },
};

const RestaurentsScreen = ({ navigation }) => {

  React.useEffect(() => {
    const onBackPress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack()
        return true
      }
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất?',
        [
          {
            text: 'Không',
            onPress: () => {
            },
            style: 'cancel',
          },
          { text: 'Có', onPress: () => {
            navigation.replace('StartScreen')
            navigation.navigate('LoginScreen')
          }},
        ],
        { cancelable: false }
      );
  
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
  
    return () => backHandler.remove();
  }, []);

  const [menuTitle, setMenuTitle] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [menus, setMenus] = useState([])
  const [recentMenus, setRecentMenus] = useState([])
  const [backup, setBackup] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [visible, setVisible] = useState(true);

  const route = useRoute();

  const total = useSelector(cartTotalSelector);

  useFocusEffect(
    useCallback(() => {
      fetchAPI()
      return () => {
        console.log('Screen was unfocused');
        // Useful for cleanup functions
      };
    }, [])
  );

  const fetchAPI = async () => {
    await axios.get(`${API}/restaurants/get`)
    .then((result) => {
      if(result.data.success){
        setRestaurants(result.data.restaurants)
      }
    })
    await axios.get(`${API}/menus/get`)
    .then((result) => {
      if(result.data.success){
        setMenus(result.data.menus)
        setBackup(result.data.menus)
      }
    })
    await axios.get(`${API}/orders/history/${route.params.user._id}`)
    .then((result) => {
      if(result.data.success) {
        var _orders = result.data.orders
        _orders.sort((a, b) => {return a._id > b._id ? -1 : a._id < b._id})
        
        var query = []
        _orders.forEach(order => order.items.forEach(item => {
          if (query.length < 3 && !query.includes(item.menuId))
            query.push(item.menuId)
          }
        ))
        setRecentMenus(query)
      }
    })
  }

  const onChangeSearch = (text) => {
    const query = backup.filter((item) => {
      const item_data = `${item.name.toUpperCase()}`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    setSearchQuery(text);
    setMenus(query);
    console.log(query);
  }

  const searchBySpeciality = (Speciality) => {
    if (Speciality == 'all' ) {
      setMenus(backup)
      setMenuTitle('')
    }
    else if (Speciality == 'recent') {
      const query = backup.filter((item) => recentMenus.includes(item._id))
      setMenus(query)
      setMenuTitle('Dựa trên lịch sử đặt hàng')
    }
    else {
      console.log(Speciality)
      const query = backup.filter((item) => {
        const item_data = `${restaurants.find(p => p._id == item.restaurantId).speciality.toUpperCase()}`;
        const text_data = Speciality.toUpperCase();
        return item_data.indexOf(text_data) > -1;
      });
      setMenus(query);
      setMenuTitle('Thể loại: ' + Speciality)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ 
      justifyContent: 'center' 
    }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: 'center'}}>
          <View style={{ flex: 1 }}>
            <Text style={{fontSize:20, fontWeight:'bold'}}> Xin chào {route.params.user.name}</Text>
            <View 
              style={{ 
                flexDirection: "row", 
                marginLeft:5,
                alignItems:'center',
              }}
            >
              <Ionicons 
                name="location-outline" 
                color="gray" 
                size={15}
              />
              <Text 
                style={{
                  color:"gray", 
                  marginLeft:5
                }}
              >
                {route.params.user.state}, TP.HCM, Việt Nam
              </Text>
            </View>
          </View>
          <View>
            <Badge visible={visible} style={styles.badge}>{total}</Badge>
            <IconButton
              icon="shopping"
              color={MD2Colors.blue500}
              size={30}
              onPress={() => navigation.navigate('CartScreen', { restaurant:route.params.restaurant, user:route.params.user})}

            />
          </View>

        </View>

        <Searchbar
          placeholder="Tìm kiếm"
          style={{
            marginVertical:15,
            padding:8,
            borderRadius:30,
            backgroundColor:'#e3e3e3',
            color: '#659349'
          }}
          theme={theme}
          clearIcon={()=><Ionicons name="filter-outline" color="#000" size={20}/>}
          onChangeText={(text) => onChangeSearch(text)}
          value={searchQuery}
        />
        <ScrollView 
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={styles.chipScrollContainer}
        >
          <View style={styles.chipContainer}>
            <Chip 
              mode='outlined'
              avatar={<Avatar.Image size={24} source={require('./../../assets/resetfood.jpeg')} />}
              onPress={() => searchBySpeciality("all")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Tất cả
            </Chip>

            <Chip 
              mode='outlined'
              // avatar={<Avatar.Image size={24} source={require('./../../assets/resetfood.jpeg')} />}
              onPress={() => searchBySpeciality("recent")} 
              style={styles.chip}
              textStyle={styles.chipText}
              disabled={recentMenus.length == 0}
            >
              Gần đây
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/foods.jpg')} />}
              onPress={() => searchBySpeciality("Foods")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Thực phẩm ăn liền, chế biến sẵn
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/drinks.jpg')} />}
              onPress={() => searchBySpeciality("Drinks")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Đồ uống các loại
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/coffee.jpg')} />}
              onPress={() => searchBySpeciality("Coffee")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Cà phê uống liền
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/milk.jpg')} />}
              onPress={() => searchBySpeciality("Milk")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Sữa các loại, sữa chua
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/fruits.jpg')} />}
              onPress={() => searchBySpeciality("Fruits")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Trái cây các loại
            </Chip>

            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/grains.jpg')} />}
              onPress={() => searchBySpeciality("Grains")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Ngũ cốc, yến mạch
            </Chip>

            
            <Chip 
              mode='outlined' 
              avatar={<Avatar.Image size={24} source={require('./../../assets/cakes.jpeg')} />}
              onPress={() => searchBySpeciality("Cakes")} 
              style={styles.chip}
              textStyle={styles.chipText}
            >
              Bánh truyền thống, bánh chưng, bánh tét,…
            </Chip>
          </View>
        </ScrollView>
        <Text style={styles.sectionTitle}>{menuTitle || 'Tất cả thực đơn'}</Text>
        {
          menus.map((menu, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.card} 
              onPress={() => navigation.navigate('MenuItemScreen', { restaurant:restaurants.find(p => p._id == menu.restaurantId), menu:menu, user:route.params.user })}
            >
              <Image source={{uri: HOST+restaurants.find(p => p._id == menu.restaurantId).image}} style={{width:"100%",height:200}}/>
              <Text style={{ fontSize:20, fontWeight:'bold',marginVertical:5}}>{menu.name} </Text>
              <View 
                style={{
                  flexDirection: "row", 
                  alignItems:'center' ,
                  marginVertical:5
                }} 
              >
              </View>

              <View 
                style={{
                  flexDirection: "row", 
                  alignItems:'center' 
                }} 
              >
                <MaterialCommunityIcons 
                  name="chef-hat" 
                  color="gray" 
                  size={15}
                />
                <Text 
                  style={{
                    color:"gray", 
                    marginLeft:5
                  }}
                >
                  Thể loại: {restaurants.find(p => p._id == menu.restaurantId).speciality}
                </Text>
                <Text>  </Text>
              </View>

            </TouchableOpacity>
          ))
        }

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:45,
    paddingHorizontal:20,
  },
  card:{
    width:'100%',
    marginVertical:20,
    backgroundColor:'#FFF',
    minHeight:250,
    padding:15,
    borderRadius:10,
    borderColor:"#000"
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 2,
  },

  chipScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  
  chipContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  chip: {
    height: 40,
    marginRight: 10,
    borderColor: '#659349',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  chipText: {
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#659349',
  },
})

export default RestaurentsScreen