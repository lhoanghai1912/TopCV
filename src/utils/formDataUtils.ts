export interface ApplyJobParams {
  JobId: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  CvId: number;
  CoverLetter: string;
  CvFile?: {
    uri: string;
    type: string;
    name: string;
  };
}

export const buildApplyJobFormData = (params: ApplyJobParams) => {
  const formData = new FormData();
  formData.append('JobId', params.JobId.toString());
  formData.append('FullName', params.FullName);
  formData.append('Email', params.Email);
  formData.append('PhoneNumber', params.PhoneNumber);
  formData.append('CvId', params.CvId.toString());
  formData.append('CoverLetter', params.CoverLetter);
  if (params.CvFile) {
    // React Native FormData hỗ trợ object với uri, type, name
    formData.append('CvFile', {
      uri: params.CvFile.uri,
      type: params.CvFile.type,
      name: params.CvFile.name,
    } as any);
  }
  return formData;
};
