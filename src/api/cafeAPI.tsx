import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = 'https://cafedb-node-react-native.herokuapp.com/api';

const cafeAPI = axios.create({baseURL});

cafeAPI.interceptors.request.use(
  async(config) => {
    const token = await AsyncStorage.getItem('token');
    if(token) {
      config.headers!['x-token'] = token;
    }
    return config;
  }
)

export default cafeAPI;