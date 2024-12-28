import { View } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button, Text, MD2Colors } from 'react-native-paper'
import { useToast } from 'react-native-toast-notifications';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios'
import { API } from './../../configs';
import { Header } from '../../components';
import styles from './../../styles'

const ChangeEmailScreen = ({ navigation }) => {

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const route = useRoute();
  
  const onSubmitPressed = async () => {
    setLoading(true)
    if(!currentEmail) {
      toast.show("Bắt buộc phải nhập email đang dùng!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!newEmail) {
      toast.show("Bắt buộc phải nhập email mới!", {
        type: "danger",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }else {
      await axios.put(`${API}/auth/updatemail/${route.params.user._id}`, {
        currentEmail: currentEmail,
        newEmail: newEmail
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
          setCurrentEmail('');
          setNewEmail('');
          navigation.popTo("LoginScreen");
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
    <View style= {styles.container}>
      <Header title="Thay đổi email" />
      <View style={styles.main} >
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            activeOutlineColor="#659349"
            mode="outlined"
            label="Email hiện tại"
            value={currentEmail}
            onChangeText={text => setCurrentEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            activeOutlineColor="#659349"
            mode="outlined"
            label="Email mới"
            value={newEmail}
            onChangeText={text => setNewEmail(text)}
            keyboardType="email-address"
          />
        </View>
        <Button 
          mode="contained" 
          loading={loading}
          buttonColor="#659349"
          onPress={onSubmitPressed}
          style={styles.button}
        >
          HOÀN TẤT
        </Button>
        <View style={styles.infoBubble}>
          <Ionicons name="information-circle-sharp" size={35} color={MD2Colors.red500}/>
          <Text style={styles.info}>Bạn sẽ được chuyển đến trang <Text style={styles.link}>đăng nhập</Text> sau khi cập nhật email</Text>
        </View>
      </View>
    </View>
  )
}

export default ChangeEmailScreen