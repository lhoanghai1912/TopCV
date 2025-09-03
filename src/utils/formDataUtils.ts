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
  formData.append('CoverLetter', params.CoverLetter);

  // CvId không bắt buộc
  if (params.CvId) {
    formData.append('CvId', params.CvId.toString());
  }

  // CvFile không bắt buộc, nếu có phải là PDF
  if (params.CvFile) {
    const isPdf = params.CvFile.type === 'application/pdf' || params.CvFile.name?.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      formData.append('CvFile', {
        uri: params.CvFile.uri,
        type: params.CvFile.type,
        name: params.CvFile.name,
      } as any);
    } else {
      throw new Error('CV file must be a PDF');
    }
  }

  return formData;
};