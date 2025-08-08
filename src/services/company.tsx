import apiClient from './apiClient';

export const getCompany = async () => {
  try {
    const response = await apiClient.get(`/Company/GetAll`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getCompanyDetails = async (id: string) => {
  try {
    const response = await apiClient.get(`/Company/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
