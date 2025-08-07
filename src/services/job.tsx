import { JobSearchParams } from '../type/type';
import apiClient from './apiClient';

export const getJob = async (params: JobSearchParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();
    console.log(`Job?${queryString}`);

    const response = await apiClient.get(`/Job/GetAll?${queryString}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getJobDetails = async (id: string) => {
  try {
    const response = await apiClient.get(`/Job/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getJobofCompany = async (id: string) => {
  try {
    const response = await apiClient.get(`Job/GetByCompany/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
