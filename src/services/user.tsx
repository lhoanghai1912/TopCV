import { use } from 'react';
import apiClient from './apiClient';
import { useSelector } from 'react-redux';
import { userInfo } from '../type/type';

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get(`/UserProfile/profile`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserInfo = async (data: userInfo) => {
  try {
    const response = await apiClient.put(`/UserProfile/profile`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadUserAvatar = async (fileUri: string): Promise<any> => {
  const formData = new FormData();
  // Lấy tên file từ uri
  const fileName = fileUri.split('/').pop() || 'avatar.jpg';
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: fileName,
  } as any);

  try {
    const res = await apiClient.post('/UserProfile/upload-avatar', formData, {
      headers: {
        accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('databack:', res);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await apiClient.delete(`/UserProfile/profile`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
