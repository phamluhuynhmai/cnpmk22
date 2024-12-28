import { View, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('StartScreen')
    }, 2000)
  })
  return (
    <View style={styles.container}>
      <Image source={require('./../assets/logo.png')} style={styles.image}/>
      <ActivityIndicator animating={true} color={MD2Colors.white} size='large'/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#659349',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    width: 150,
    height: 150,
    borderRadius:75,
    marginBottom:100,
  }
})

export default SplashScreen