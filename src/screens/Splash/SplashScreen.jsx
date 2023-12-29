import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      checkToken() 
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);


    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.navigate('MainTabs');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.navigate('Login');
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aniload</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SplashScreen;