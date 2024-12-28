import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button, Text } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios'
import { API } from './../../configs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { districts as districtsImported } from '../../data/districts';

const RegisterScreen = ({ navigation }) => {

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const districts = districtsImported

  const onSignupPressed = async () => {
    setLoading(true)
    if(!name) {
      toast.show("Bắt buộc phải nhập tên!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!surname) {
      toast.show("Bắt buộc phải nhập họ và tên!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!phone) {
      toast.show("Bắt buộc phải nhập số điện thoại!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!address) {
      toast.show("Bắt buộc phải nhập địa chỉ!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    /*else if(!district) {
      toast.show("State is required !", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }*/
    else if(!email) {
      toast.show("Bắt buộc nhập email!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!password) {
      toast.show("Bắt buộc nhập mật khẩu!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }else {
      await axios.post(`${API}/auth/register`, {
        name: name,
        surname:surname,
        phone: phone,
        address:address,
        state:district,
        email:email,
        password: password
      }).then((result) => {
        console.log(result.data)
        if(result.data.success) {
          toast.show(result.data.message, {
            type: "success",
            placement:"bottom",
            duration: 4000,
            offset: 30,
            animationType: "zoom-in"
          })
          setLoading(false);
          setName("");
          setSurname("");
          setPhone("");
          setAddress("");
          setDistrict("");
          setEmail("");
          setPassword("");
          navigation.replace("LoginScreen");
        }else {
          toast.show(result.data.message, {
            type: "danger",
            placement:"bottom",
            duration: 4000,
            offset: 30,
            animationType: "zoom-in"
          })
          setLoading(false);
        }
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ 
      justifyContent: 'center' 
    }}>
      <View style= {styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
        </View>
        <View style={styles.main} >
          <Text style={{fontSize: 30, color: '#659349', fontWeight: 'bold'}}>
            Tạo tài khoản
          </Text>
          <View style={styles.inputView}>
            <View style={styles.fullname}>
              <TextInput
                style={styles.mininput}
                activeOutlineColor="#659349"
                mode="outlined"
                label="Tên"
                value={name}
                onChangeText={text => setName(text)}
              />

              <TextInput
                style={styles.mininput}
                activeOutlineColor="#659349"
                mode="outlined"
                label="Họ"
                value={surname}
                onChangeText={text => setSurname(text)}
              />
            </View>
            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              mode="outlined"
              label="Số điện thoại"
              value={phone}
              onChangeText={text => setPhone(text)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              mode="outlined"
              label="Địa chỉ"
              value={address}
              onChangeText={text => setAddress(text)}
            />

            <SelectDropdown
              data={districts}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index);
                setDistrict(selectedItem)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text
                      style={styles.dropdownButtonTxtStyle}>
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
                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
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
                // console.log(selectedItem, index);
                // setDistrict(selectedItem)
                setWard(selectedItem)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text
                      style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && [...(districts.find((d) => d.title == district.title) || {value: []}).value].includes(selectedItem)) ? selectedItem : 'Phường / Xã'}
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
                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />

            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              secureTextEntry={true} 
              mode="outlined"
              label="Mật khẩu"
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <Button 
            mode="contained" 
            loading={loading}
            buttonColor="#659349"
            onPress={onSignupPressed}
            style={styles.button}
          >
            ĐĂNG KÝ
          </Button>
          <View style={styles.row}>
          <Text>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.link}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#659349'
  },
  header: {
    marginVertical: 20,
    marginHorizontal:20,
    width:'100%',
    height:100
  },
  title:{
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 20
  },
  inputView:{
    marginTop:50
  },
  fullname: {
    flexDirection:'row',
  },
  mininput:{
    width:'49%',
    marginRight:5,
    marginBottom: 10,
  },

  input:{
    marginBottom:10,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 10,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  button: {
    height: 60,
    marginTop: 20,
    justifyContent: "center",
    borderRadius: 30,
    marginTop:10,
    margin:'1%'
  },
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 10,
  },
  link: {
    fontWeight: 'bold',
    color: '#659349',
  },
  dropdownButtonStyle: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 10,
    margin: '1%',
    height: 50,
    // backgroundColor: '#FFF',
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
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    // backgroundColor: '#E9ECEF',
    // height: '100%',
    borderRadius: 8,
    flex: 1,
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
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
})

export default RegisterScreen