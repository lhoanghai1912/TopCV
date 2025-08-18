// src/services/apiClient.ts
import axios from 'axios';
import store from '../store';
import Toast from 'react-native-toast-message';

const apiClient = axios.create({
  baseURL: 'https://bds.foxai.com.vn:3456/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('API Error:', error.message);
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const value = data?.value;
      const message =
        value || data?.message || data?.error || JSON.stringify(data);
      console.log('📥 Response status:', status);
      console.log('📦 Response data:', data);
      Toast.show({
        type: 'error',
        text1: `Lỗi ${status}`,
        text2: message,
      });
    } else if (error.request) {
      console.log('📡 No response received:', error.request);
    } else {
      console.log('⚠️ Error setting up request:', error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
