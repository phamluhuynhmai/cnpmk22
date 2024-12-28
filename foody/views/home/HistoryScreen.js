import { ScrollView ,View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React,{ useState, useCallback } from 'react'
import { Header } from '../../components';
import { Searchbar, IconButton, MD2Colors, Badge, Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios'
import { API } from './../../configs';

const HistoryScreen = ({ navigation }) => {

  const [orders, setOrders] = useState([]);
  const [backup, setBackup] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(true);

  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      fetchAPI()
      return () => {
        console.log('Screen was unfocused');   
      };
    }, [])
  );

  const fetchAPI = async () => {
    await axios.get(`${API}/orders/history/${route.params.user._id}`)
    .then((result) => {
      if(result.data.success) {
        setOrders(result.data.orders);
        setBackup(result.data.orders)
      }
    })
  }

  const onChangeSearch = (text) => {
    const query = backup.filter((item) => {
      const item_data = `${item.createdAt.toUpperCase()}`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    setSearchQuery(text);
    setOrders(query);
    console.log(query);
  }

  return (
    <ScrollView contentContainerStyle={{ 
      justifyContent: 'center',
      flexGrow:1
    }}>
      <View style={styles.container}>
        <Header title="Lịch sử đặt hàng" />
        <Searchbar
          placeholder="Tìm kiếm"
          style={{
            marginVertical:15,
            padding:8,
            borderRadius:30,
            backgroundColor:'#e3e3e3'
          }}
          clearIcon={()=><Ionicons name="filter-outline" color="#000" size={20}/>}
          onChangeText={(text) => onChangeSearch(text)}
          value={searchQuery}
        />
        {
          orders.map((order, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.card} 
              disabled={true}
            >
              <View style={styles.cardcontent}>
                <Image style={styles.cardimage} source={require('./../../assets/orders.jpg')} />
                <View style={styles.carddetails}>
              
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
                      color={MD2Colors.black500} 
                      size={15}
                    />
                    <Text style={{fontSize:20, fontWeight:'bold', color: MD2Colors.black500, marginLeft:5} }>{ order.totalPrice} ₫</Text>
                  </View>

                  <View 
                    style={{ 
                      flexDirection: "row", 
                      marginLeft:20,
                      alignItems:'center' 
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
                      {new Date(order.createdAt).toLocaleDateString()+ ' '+new Date(order.createdAt).toLocaleTimeString()}
                    </Text>
                  </View>
                {
                  order.status === true ?
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        marginLeft:20,
                        alignItems:'center',
                        marginTop:20
                      }}
                    >
                      <MaterialCommunityIcons 
                        name="thumb-up-outline" 
                        color={MD2Colors.green500} 
                        size={15}
                      />
                      <Text 
                        style={{
                          color:MD2Colors.green500, 
                          marginLeft:5
                        }}
                      >
                        Valid
                      </Text>
                    </View>
                  :
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        marginLeft:20,
                        alignItems:'center',
                        marginTop:20
                      }}
                    >
                      <MaterialCommunityIcons 
                        name="thumb-down-outline" 
                        color={MD2Colors.red500} 
                        size={15}
                      />
                      <Text 
                        style={{
                          color:MD2Colors.red500, 
                          marginLeft:5
                        }}
                      >
                        Invalid
                      </Text>

                    </View>
                  }
                </View>
              </View>
              <View style={styles.cardaction}>
                <Button icon="format-list-text" mode="text" compact={true} onPress={() => navigation.navigate('OrderDetailScreen', { orders: order.items})}>
                  Chi tiết
                </Button>
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
    marginBottom:20
  },
  card:{
    width:'100%',
    marginVertical:5,
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
  cardaction:{
    flexDirection:'row',
    color: '#659349',
    marginTop:20
  },
})

export default HistoryScreen