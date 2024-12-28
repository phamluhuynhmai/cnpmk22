import {View } from 'react-native'
import React, { useState } from 'react'
import { Header } from '../../components';
import { TextInput, Button, Text, MD2Colors } from 'react-native-paper'
import { useToast } from 'react-native-toast-notifications';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios'
import { API } from './../../configs';
import styles from './../../styles'

const ChangePasswordScreen = ({ navigation }) => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const route = useRoute();

  const onSubmitPressed = async () => {
    setLoading(true)
    if(!currentPassword) {
      toast.show("Bắt buộc phải nhập mật khẩu hiện tại!", {
        type: "warning",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if(!newPassword) {
      toast.show("Bắt buộc phải nhập mật khẩu!", {
        type: "warning",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else if (newPassword != confirmPassword) {
      toast.show("Nhập lại mật khẩu không đúng!", {
        type: "warning",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      })
      setLoading(false)
    }
    else {
      await axios.put(`${API}/auth/updatepassword/${route.params.user._id}`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
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
          setCurrentPassword('');
          setNewPassword('');
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
      <Header title="Thay đổi mật khẩu" />
      <View style={styles.main} >
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            activeOutlineColor="#659349"
            secureTextEntry={true} 
            mode="outlined"
            label="Mật khẩu hiện tại"
            value={currentPassword}
            onChangeText={text => setCurrentPassword(text)}
          />
          <TextInput
            style={styles.input}
            activeOutlineColor="#659349"
            secureTextEntry={true} 
            mode="outlined"
            label="Mật khẩu mới"
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
          />
          <TextInput
            style={styles.input}
            activeOutlineColor="#659349"
            secureTextEntry={true} 
            mode="outlined"
            label="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
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
          <Text style={styles.info}>Bạn sẽ được chuyển đến trang <Text style={styles.link}>đăng nhập</Text> sau khi cập nhật mật khẩu</Text>
        </View>
      </View>
    </View>
  )
}

export default ChangePasswordScreen