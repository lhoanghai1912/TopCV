export type CareerGoal = string;

export type Education = {
  startDate?: string;
  endDate?: string;
  school?: string;
  major?: string;
  desc?: string;
};

export type Experience = {
  startDate?: string;
  endDate?: string;
  company?: string;
  position?: string;
  desc?: string;
};

export type Activity = {
  startDate?: string;
  endDate?: string;
  organization?: string;
  position?: string;
  desc?: string;
};

export type Certificate = {
  time?: string;
  name?: string;
};

export type Award = {
  time?: string;
  name?: string;
};

export type Skill = {
  name?: string;
  desc?: string;
};

export type Reference = {
  info?: string;
};

export type Hobby = string;

// Helper function để tạo FormData cho API
export const createCVFormData = (cvData: any, imageUri?: string): FormData => {
  const formData = new FormData();
  
  // Chuẩn bị dữ liệu CV
  const jsonCvData = {
    templateId: cvData.templateId || 2,
    isPublic: cvData.isPublic || true,
    title: cvData.title || '',
    name: cvData.name || '',
    content: cvData.content || '',
    birthday: cvData.birthday || '',
    gender: cvData.gender || '',
    phoneNumber: cvData.phone || '',
    email: cvData.email || '',
    website: cvData.website || '',
    address: cvData.address || '',
    // Có ảnh thì dùng path, không có ảnh thì photoCard = ""
    photoCard: imageUri ? (cvData.photoCard || "") : "",
    sections: cvData.sections || [],
    skills: cvData.skills || [],
    experiences: cvData.experiences || [],
    educations: cvData.educations || [],
    certifications: cvData.certificate || cvData.certifications || [],
    languages: cvData.languages || [],
  };

  // Append JSON data
  formData.append('jsonCvData', JSON.stringify(jsonCvData));
  
  // Có ảnh thì append ảnh
  if (imageUri) {
    const fileName = imageUri.split('/').pop() || 'photo-card.jpg';
    formData.append('images', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    } as any);
  }

  return formData;
};
