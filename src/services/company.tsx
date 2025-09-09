import { SearchParams } from '../type/type';
import apiClient from './apiClient';

export const getCompany = async (params: SearchParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();
    const response = await apiClient.get(`/Company/GetAll?${queryString}`);
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

export const followCompany = async (companyId: string) => {
  try {
    const response = await apiClient.post(`/Company/${companyId}/follow`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFollowedCompanies = async () => {
  try {
    const response = await apiClient.get(`/Company/followed-companies`);
    return response.data;
  } catch (error) {}
};
