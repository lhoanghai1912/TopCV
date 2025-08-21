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
