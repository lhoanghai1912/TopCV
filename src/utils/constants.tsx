import { logout } from '../store/reducers/userSlice';

export const MESSAGES = {
  loginSuccess: 'Login successful!',
  loginFailed: 'Login failed. Please try again.',
  networkError: 'Network error. Please check your internet connection.',
};

export const TITLES = {
  login: 'Đăng nhập',
  home: 'Home',
  profile: 'Profile',
  settings: 'Settings',
  accept: 'Xác nhận',
  cancel: 'Hủy bỏ',
  logout: 'Logout',
  menu: 'Menu',
  transaction: 'Transaction',
  report: 'Report',
  user: 'User',
};

export const link = {
  url: 'https://bds.foxai.com.vn:3456',
  company: 'https://fox.ai.vn/',
  privacy: 'https://fox.ai.vn/chinh-sach-bao-mat/',
  terms: 'https://fox.ai.vn/dieu-khoan-thoa-thuan/',
};
