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
    // Kiểm tra status code - nếu khác 200 thì vào error
    if (response.status !== 200) {
      const status = response.status;
      const data = response.data;
      const value = data?.value;
      const message =
        value ||
        data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        'Request không thành công';

      console.log('📥 Non-200 status:', status);
      console.log('📦 Response data:', data);

      Toast.show({
        type: 'error',
        text2: message,
      });

      // Tạo error object để reject
      const error = new Error(message);
      (error as any).response = response;
      (error as any).status = status;
      return Promise.reject(error);
    }

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
      // if (status === 401) {
      //   console.log('📡 401 URL:', error.response.config?.url);
      //   Toast.show({
      //     type: 'error',
      //     text2: `401: ${error.response.config?.url}`,
      //   });
      // } else {
      //   Toast.show({
      //     type: 'error',
      //     text2: message,
      //   });
      // }
    } else if (error.request) {
      console.log('📡 No response received:', error.request);
      Toast.show({
        type: 'error',
        text1: 'Lỗi kết nối',
        text2: 'Không thể kết nối đến server',
      });
    } else {
      console.log('⚠️ Error setting up request:', error.message);
      Toast.show({
        type: 'error',
        text2: error.message,
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
