import axios from 'axios';
import { API_URL, API_TOKEN, API_KEY } from '../utils/constants';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  config.params['api_key'] = API_KEY;
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
