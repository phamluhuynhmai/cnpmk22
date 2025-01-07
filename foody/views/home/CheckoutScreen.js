import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput as RNTextInput } from 'react-native'
import React,{ useState } from 'react'
import { IconButton, MD2Colors, Badge, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios'
import { API } from './../../configs'
import { cartTotalPriceSelector, cartTotalSelector } from "./../../redux/selector";
import {
  clear,
} from "./../../redux/features/CartSlice";
import { HOST } from './../../configs';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { districts as districtsImported } from '../../data/districts';

const CheckoutScreen = ({ navigation }) => {

  const [visible, setVisible] = useState(true);
  
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [cost, setCost] = useState(0);
  const districts = districtsImported;

  const cart = useSelector((state) => state.cart);
  const totalPrice = useSelector(cartTotalPriceSelector);
  const total = useSelector(cartTotalSelector);

  const dispatch = useDispatch()

  const toast = useToast()
  const route = useRoute();

  const onOrderSubmit = async () => {
  
    if(!district) {
      toast.show("Bắt buộc phải chọn quận / huyện!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      return;
    }
    if(!address) {
      toast.show("Bắt buộc phải nhập địa chỉ!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      return;
    }

    await axios.post(`${API}/orders/create`, {
      clientId: route.params.user._id,
      items: cart,
      restaurantId: route.params.restaurant._id,
      totalPrice:totalPrice + cost,
      paymentType: "Cash on delivery",
      paid: false,
      
      state: district.title,
      address: address,
      
    }).then((result) => {
      if(result.data.success) {
        toast.show(result.data.message, {
          type: "success",
          placement:"bottom",
          duration: 4000,
          offset: 30,
          animationType: "zoom-in"
        })
        dispatch(clear())
        navigation.popTo('Hello', {user: route.params.user})
      }else {
        toast.show(result.data.message, {
          type: "danger",
          placement:"bottom",
          duration: 4000,
          offset: 30,
          animationType: "zoom-in"
        })
      }
    })
  }
  return (
    <ScrollView contentContainerStyle={{ 
      justifyContent: 'center',
      flexGrow:1
    }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: 'center'}}>
          <View style={{ flex: 1 }}>
            <Text style={{fontSize:20, fontWeight:'bold'}}> Kiểm tra giỏ hàng</Text>
          </View>
          <View>
            <Badge visible={visible} style={styles.badge}>{total}</Badge>
            <IconButton
              icon="shopping"
              color={MD2Colors.blue500}
              size={30}
            />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={{fontSize:20, fontWeight:'bold', color: '#3C4048', marginBottom:10} }>Món</Text>
          {
            cart.map((item, index) => (
              <TouchableOpacity key={index} style={styles.minicard}>
                <Image style={styles.minicardimage}source={{uri:HOST+item.image}} />
                <View style={styles.minicarddetails}>
                  <Text style={{fontSize:20, fontWeight:'bold', color: '#659349', marginLeft:5}}>{item.name}</Text>
                  <Text style={{fontSize:15, fontWeight:'bold', color: '#3C4048', marginLeft:5}}>{item.quantity+' x '+item.price} ₫</Text>
                </View>
              </TouchableOpacity>
            ))
          }
          <Button 
            mode="text" 
            textColor='#659349'
            style={styles.button}
          >
              Tổng cộng: {totalPrice + (cost > 0 ? (' + ship ' + cost + ' = ' + (totalPrice + cost)) : '')} ₫
          </Button>
          <Text style={{fontSize:20, fontWeight:'bold', color: '#3C4048', marginBottom:10}}>Nhập địa chỉ giao hàng</Text>

          <SelectDropdown
            data={districts}
            onSelect={(selectedItem, index) => {
              setDistrict(selectedItem)
              setCost(selectedItem.cost)
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) || 'Quận / Huyện'}
                  </Text>
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />

          <SelectDropdown
            data={[...(districts.find((d) => d.title == district.title) || {value: []}).value]}
            onSelect={(selectedItem, index) => {
              // Handle ward selection
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {selectedItem || 'Phường / Xã'}
                  </Text>
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />

          <RNTextInput
            style={styles.addressInput}
            placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường...)"
            placeholderTextColor="#617168"
            value={address}
            onChangeText={text => setAddress(text)}
            multiline={true}
          />
          
          <Button 
            mode="contained" 
            buttonColor="#659349"
            onPress={onOrderSubmit}
            style={styles.button}
          >
              Đặt hàng
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:45,
    paddingHorizontal:20,
    marginBottom:5
  },
  card:{
    flex:1,
    width:'100%',
    marginVertical:20,
    backgroundColor:'#FFF',
    padding:15,
    borderRadius:10,
    borderWidth:1,
    borderColor:"#dadada"
  },
  minicard:{
    flexDirection:'row',
    alignItems: 'center',
    marginBottom:10,
    borderWidth:1,
    borderColor:"#659349",
    borderRadius:10,
    padding:10,
  },
  minicardimage:{
    width:100,
    height:100,
    borderRadius:10
  },
  minicarddetails:{
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
  },
  button: {
    width:'100%',
    height: 60,
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 30,
    margin:'1%'
  },
  
  dropdownButtonStyle: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 10,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#888',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
  },
  
  addressInput: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#659349',
    textColor: '#659349',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'center',
    minHeight: 50,
    fontSize: 16,
  },
  
})

export default CheckoutScreen