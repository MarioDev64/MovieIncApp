import axios from 'axios';
import { API_URL, API_TOKEN, API_KEY } from '../utils/constants';
import eventEmitter, { EVENT_SESSION_EXPIRED } from '../utils/eventEmitter';

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

//Trigger an event to display session expired dialog.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      eventEmitter.emit(EVENT_SESSION_EXPIRED);
    }
    return Promise.reject(error);
  }
);