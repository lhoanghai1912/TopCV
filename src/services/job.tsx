import { JobSearchParams } from '../type/type';
import apiClient from './apiClient';
import { buildApplyJobFormData, ApplyJobParams } from '../utils/formDataUtils';

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
    console.log('getjobDetails');

    throw error;
  }
};

export const getJobofCompany = async (id: string) => {
  try {
    const response = await apiClient.get(`Job/GetByCompany/${id}`);
    return response.data;
  } catch (error) {
    console.log('abc', error);
    throw error;
  }
};

export const patchSavedJob = async (jobId: string) => {
  try {
    const response = await apiClient.patch(`Job/${jobId}/toggle-save`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedJobs = async () => {
  try {
    const response = await apiClient.get(`Job/saved`);
    return response.data;
  } catch (error) {}
};

// ...existing code...

export const applyJob = async (params: ApplyJobParams) => {
  try {
    const formData = buildApplyJobFormData(params);
    const response = await apiClient.post('/Application/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ...existing code...
