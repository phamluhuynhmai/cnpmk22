import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React,{ useState, useCallback } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar, IconButton, MD2Colors, Badge } from 'react-native-paper';
import axios from 'axios'
import { useToast } from 'react-native-toast-notifications';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { API, HOST } from './../../configs';

import { useDispatch, useSelector } from 'react-redux'
import { cartTotalSelector } from "./../../redux/selector";
import { addToCart } from './../../redux/features/CartSlice'

const MenuItemScreen = ({ navigation }) => {

  const [menu, setMenu] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [visible, setVisible] = useState(true);

  const [backup, setBackup] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const toast = useToast();
  const route = useRoute();

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart);
  useFocusEffect(
    useCallback(() => {
      fetchAPI()
      console.log(cart)
      return () => {
        // Useful for cleanup functions
       
      };
    }, [cart])
  );

  const fetchAPI = async () => {
    await axios.get(`${API}/menus/getitems/${route.params.restaurant._id}`)
    .then((result) => {
      if(result.data.success) {
        setMenu(result.data.menu);
        setMenuItems(result.data.items)
        setBackup(result.data.items)
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
    setMenuItems(query);
    console.log(query);
  }

  const total = useSelector(cartTotalSelector);

  return (
    <ScrollView contentContainerStyle={{ 
      justifyContent: 'center' 
    }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: 'center'}}>
          <View style={{ flex: 1 }}>
            <Text style={{fontSize:20, fontWeight:'bold'}}> {route.params.restaurant.name}</Text>
            <View 
              style={{ 
                flexDirection: "row", 
                marginLeft:5,
                alignItems:'center'
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
                {route.params.restaurant.state}, TP.HCM, Việt Nam
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
            color:'#659349',
            backgroundColor:'#e3e3e3'
          }}
          clearIcon={()=><Ionicons name="filter-outline" color="#000" size={20}/>}
          onChangeText={(text) => onChangeSearch(text)}
          value={searchQuery}
        />

        {
          menuItems.map((item, index) => {
            if (item.menuId != route.params.menu._id)
              return
            return (
            <TouchableOpacity 
              key={index}
              style={styles.card} 
              disabled={true}
            >
              <Image source={{uri: HOST+item.image}} style={{width:"100%",height:200}}/>
              <View style={{ flexDirection: "row", alignItems: 'center'}}>
              <View style={{ flex: 1 }}>
                
                <Text style={{fontSize:20, fontWeight:'bold',marginVertical:5}}> {item.name}</Text>
                <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:5,
                    alignItems:'center' ,
                    marginVertical:5
                  }}
                >
                  <Ionicons 
                    name="time-outline" 
                    color="gray" 
                    size={15}
                  />
                  <Text 
                    style={{
                      color:"gray", 
                      marginLeft:5
                    }}
                  >
                    20-30 phút
                  </Text>
                  <Text>  </Text>
                  <Ionicons 
                    name="star" 
                    color="orange" 
                    size={15}
                  />
                  <Text            
                    style={{
                      color:"gray", 
                      marginLeft:5
                    }}>
                    5
                  </Text>
                </View>
    
                <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:5,
                    alignItems:'center',
                    marginVertical:5
                  }}
                >
                  <Ionicons 
                    name="pricetag-outline" 
                    color={MD2Colors.black500} 
                    size={15}
                  />
                  <Text style={{fontSize:20, fontWeight:'bold', color: MD2Colors.black500, marginLeft:5} }>
                    {item.price} ₫
                  </Text>
                </View>
              </View>
              <IconButton
                icon="cart"
                color={MD2Colors.blue500}
                size={30}
                onPress={() => dispatch(addToCart(item))}
              />
            </View>
            </TouchableOpacity>
          )})
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
    borderWidth:1,
    borderColor:"#dadada"
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 2,
  },

})

export default MenuItemScreen