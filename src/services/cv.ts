import apiClient from './apiClient';
import { createCVFormData } from '../type/cv';

// API tạo CV duy nhất - đơn giản
export const createCV = async (
  cvData: any,
  imageUri?: string
) => {
  try {
    // Tạo FormData từ helper function
    const formData = createCVFormData(cvData, imageUri);
    console.log('=== ĐANG TẠO CV ===');
    console.log('Có ảnh:', imageUri ? 'Có' : 'Không');
    console.log('PhotoCard:', imageUri ? (cvData.photoCard || "") : "");

    const response = await apiClient.post('/Cv/create-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('=== TẠO CV THÀNH CÔNG ===');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cho phép truyền thêm imageUri là tham số riêng
export const updateCV = async (cvId: string, cvData: any, imageUri?: string) => {
  try {
    const formData = new FormData();
    formData.append('jsonCvData', JSON.stringify(cvData));
    // Nếu có ảnh, thêm vào formData
    if (imageUri) {
      formData.append('PhotoCardFile', {
        uri: imageUri,
        type: 'images/jpeg',
        name: 'avatar.jpg',
      } as any);
    }
    const response = await apiClient.put(`/Cv/${cvId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCV = async () => {
  try {
    const response = await apiClient.get('/Cv');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm lấy danh sách CV có phân trang
export const getCVList = async (page: number, pageSize: number) => {
  try {
    const response = await apiClient.get(`/Cv?page=${page}&pageSize=${pageSize}&OrderBy=createdAt%20desc`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCVDetail = async (cvId: string) => {
  try {
    const response = await apiClient.get(`/Cv/${cvId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplicationDetail = async (applicationId: string) => {
  try {
    const response = await apiClient.get(`/Application/user/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
