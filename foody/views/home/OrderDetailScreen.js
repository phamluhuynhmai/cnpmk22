import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React,{ useState, useCallback } from 'react'
import { IconButton, MD2Colors, Badge } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { HOST } from '../../configs';

const OrderDetailScreen = ({ navigation }) => {

  const [visible, setVisible] = useState(true);
  const route = useRoute();
  const [restaurants, setRestaurants] = useState([])

  useFocusEffect(
    useCallback(() => {
      fetchAPI()
      return () => {
        console.log('Screen was unfocused');   
      };
    }, [])
  );

  const fetchAPI = async () => {
    await axios.get(`${API}/restaurants/get`)
    .then((result) => {
      if(result.data.success){
        setRestaurants(result.data.restaurants)
        setBackup(result.data.restaurants)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: 'center'}}>
        <View style={{ flex: 1 }}>
          <Text style={{fontSize:20, fontWeight:'bold'}}> Chi tiết đơn hàng</Text>
        </View>
        <View>
          <Badge visible={visible} style={styles.badge}>0</Badge>
          <IconButton
            icon="shopping"
            color={MD2Colors.blue500}
            size={30}
            onPress={() => console.log('Pressed')}
          />
        </View>
      </View>
      {
        route.params.orders.map((order, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.card} 
            // onPress={() => navigation.navigate('MenuItemScreen', {restaurant: restaurants.find(r => r._id == order.restaurantID)})}
            // cái này lỗi cmnr
          >
            <View style={styles.cardcontent}>
              <Image style={styles.cardimage} source={{uri: HOST+order.image}} />
              <View style={styles.carddetails}>
            
                <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:20,
                    alignItems:'center',
                    marginVertical:5
                  }}
                >
                  <MaterialCommunityIcons 
                    name="chef-hat" 
                    color={MD2Colors.black500} 
                    size={15}
                  />
                  <Text style={{fontSize:20, fontWeight:'bold', color: MD2Colors.black500, marginLeft:5} }>{order.name}</Text>
                </View>

                <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:20,
                    alignItems:'center',
                    marginVertical:5
                  }}
                >
                  <Ionicons 
                    name="pricetag-outline" 
                    color={MD2Colors.green500} 
                    size={15}
                  />
                  <Text style={{fontSize:15, color: MD2Colors.green500, marginLeft:5} }>{order.price} ₫</Text>

                  <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:20,
                    alignItems:'center',
                    marginVertical:5
                  }}
                >
                  <Ionicons 
                    name="grid-outline" 
                    color={MD2Colors.blue500} 
                    size={15}
                  />
                  <Text style={{fontSize:15, color: MD2Colors.blue500, marginLeft:5} }>{order.quantity}</Text>
                </View>

                </View>

                <View 
                  style={{ 
                    flexDirection: "row", 
                    marginLeft:20,
                    alignItems:'center' 
                  }}
                >
                  <MaterialCommunityIcons 
                    name="equal" 
                    color="gray" 
                    size={15}
                  />
                  <Text 
                    style={{
                      color:"gray", 
                      fontSize:15,
                      marginLeft:5
                    }}
                  >
                    {order.price * order.quantity} ₫
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
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
    marginVertical:10,
    backgroundColor:'#FFF',
    minHeight:100,
    padding:15,
    borderRadius:10,
    borderWidth:1,
    borderColor:"#dadada"
  },
  cardcontent:{
    flexDirection:'row',
    alignItems: 'center'
  },
  cardimage:{
    width:100,
    height:100,
    borderRadius:10
  },
  carddetails:{
    flex:1,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 2,
  },
  totalPrice:{
    alignItems:'center',
    width:'100%',
    marginVertical:10,
    backgroundColor:'#FFF',
    minHeight:40,
    padding:15,
    borderRadius:10,
    borderColor:"#000"
  }
})

export default OrderDetailScreen