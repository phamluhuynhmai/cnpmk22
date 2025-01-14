import { View, StyleSheet, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { Logo } from './../components'
import { Button } from 'react-native-paper'

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.footer} >
        <Text style={styles.title}>
          Programming Interns
        </Text>
        <Text style={styles.text}>Mời bạn đăng nhập hoặc đăng ký</Text>
        <View style={styles.btnView}>
          <Button 
            mode="contained" 
            buttonColor="#659349"
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.button}
          >
            ĐĂNG NHẬP
          </Button>

          <Button 
            mode="contained" 
            buttonColor="#659349"
            onPress={() => navigation.navigate("RegisterScreen")}
            style={styles.button}>
            ĐĂNG KÝ
          </Button>
        </View>
      </View>
    </View>
  )
}
const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#659349'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo:{
    width: height_logo,
    height: height_logo,
    borderRadius:height_logo / 2,

  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: 'grey',
    marginTop:5
  },
  btnView: {
    flexDirection:'row',
  },
  button: {
    width:'48%',
    height: 60,
    marginTop: 20,
    justifyContent: "center",
    borderRadius: 30,
    marginTop:30,
    margin:'1%'
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 20
  },
})

export default StartScreen