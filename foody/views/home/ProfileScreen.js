import { ScrollView, View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button, Text, MD2Colors } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useToast } from 'react-native-toast-notifications';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios'
import { API } from './../../configs';
import { Header } from '../../components';
import styles from './../../styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { districts as districtsImported} from './../../data/districts';

const ProfileScreen = ({ navigation }) => {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const route = useRoute();

  const districts = districtsImported;

  const onSubmitPressed = async () => {
    setLoading(true)
    if(!nom) {
      toast.show("Bắt buộc nhập tên!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!prenom) {
      toast.show("Bắt buộc nhập họ!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!telephone) {
      toast.show("Bắt buộc nhập số điện thoại!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!adresse) {
      toast.show("Bắt buộc nhập địa chỉ!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!district) {
      toast.show("State is required !", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }else {
      await axios.put(`${API}/auth/profile/${route.params.user._id}`, {
        nom: nom,
        prenom:prenom,
        telephone: telephone,
        adresse:adresse,
        state:district
      }).then((result) => {
        if(result.data.success) {
          toast.show(result.data.message, {
            type: "success",
            placement:"bottom",
            duration: 4000,
            offset: 30,
            animationType: "zoom-in"
          })
          setLoading(false);
          setNom("");
          setPrenom("");
          setTelephone("");
          setAdresse("");
          setDistrict("");
          setWard("");
          navigation.navigate("LoginScreen");
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
      justifyContent: 'center' ,
      flexGrow: 1
    }}>
      <View style= {styles.container}>
        <Header title="Thông tin người dùng" />
        <View style={styles.main} >
          <View style={styles.inputView}>
            <View style={styles.fullname}>
              <TextInput
                style={styles.mininput}
                activeOutlineColor="#659349"
                mode="outlined"
                label="Tên"
                value={nom}
                onChangeText={text => setNom(text)}
              />

              <TextInput
                style={styles.mininput}
                activeOutlineColor="#659349"
                mode="outlined"
                label="Họ"
                value={prenom}
                onChangeText={text => setPrenom(text)}
              />
            </View>
            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              mode="outlined"
              label="Số điện thoại"
              value={telephone}
              onChangeText={text => setTelephone(text)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              activeOutlineColor="#659349"
              mode="outlined"
              label="Địa chỉ"
              value={adresse}
              onChangeText={text => setAdresse(text)}
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
          </View>
          <Button 
            mode="contained" 
            loading={loading}
            buttonColor="#659349"
            onPress={onSubmitPressed}
            style={styles.button}
          >
            CẬP NHẬT
          </Button>
          <View style={styles.infoBubble}>
            <Ionicons name="information-circle-sharp" size={35} color={MD2Colors.red500}/>
            <Text style={styles.info}>Bạn sẽ được chuyển đến trang <Text style={styles.link}>đăng nhập</Text> sau khi cập nhật mật khẩu</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfileScreen