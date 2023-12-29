import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axios = Axios.create({
  baseURL: 'http://192.168.29.138:4000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const setAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error setting authentication token:', error);
  }
};

setAuthToken(); // Set initial token

export const setToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export default axios;
