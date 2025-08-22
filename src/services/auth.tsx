// src/services/auth.service.ts

import Toast from 'react-native-toast-message';
import apiClient from './apiClient';

export const login = async (contact: string, password: string) => {
  const res = await apiClient.post('/Account/login-with-password', {
    contact,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await apiClient.post('/Account/forgot-password', { email });
  return res.data;
};

export const register = async (contact: string) => {
  const res = await apiClient.post('Account/register-with-otp', {
    contact: contact,
  });

  return res.data;
};

export const enterOtp = async (contact: string, otp: string) => {
  const res = await apiClient.post('Account/verify-otp', {
    contact: contact,
    otp: otp,
  });
  return res.data;
};

export const create_password = async (
  verificationToken: string,
  password: string,
  confirmPassword: string,
  fullName: string,
  role: string,
  phoneNumber: string,
) => {
  console.log(
    'token',
    verificationToken,
    'pass',
    password,
    'confirmpass',
    confirmPassword,
    'fullname',
    fullName,
    'role',
    role,
    'phone',
    phoneNumber,
  );

  const res = await apiClient.post('/Account/create-password', {
    verificationToken: verificationToken,
    password: password,
    confirmPassword: confirmPassword,
    fullName: fullName,
    role: role,
    phoneNumber: phoneNumber,
  });
  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const response = await apiClient.post(`/Account/change-password`, {
      currentPassword,
      newPassword,
    });
    Toast.show({
      type: 'success',
      text1: response.data.message.value,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  const res = await apiClient.get('/UserProfile/profile', {});
  return res.data;
};
