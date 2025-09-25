import { SearchParams } from '../type/type';
import apiClient from './apiClient';
import { buildApplyJobFormData, ApplyJobParams } from '../utils/formDataUtils';

export const getJob = async (params: SearchParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

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

export const getAppliedJobs = async (page?: number, pageSize?: number) => {
  try {
    const response = await apiClient.get(
      page && pageSize
        ? `/Application/user/applications?page=${page}&pageSize=${pageSize}&OrderBy=appliedAt%20desc`
        : `/Application/user/applications?OrderBy=appliedAt%20desc`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ...existing code...
