import apiClient from './apiClient';
import moment from 'moment';

export const createCV = async (
  cvData: any,
  photoCardFile?: { uri: string; type: string; name: string }
) => {
  // Đảm bảo ngày tháng đúng format yyyy-mm-dd bằng moment
  const formatDate = (date: string) => {
    if (!date) return '';
    // MM/YY hoặc MM-YY => YYYY-MM-DD (năm 20YY, ngày 01)
    if (/^\d{2}[-/]\d{2}$/.test(date)) {
      const [month, year] = date.split(/[-\/]/);
      const fullYear = year.length === 2 ? `20${year}` : year;
      return moment(`${fullYear}-${month}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    // yyyy-mm hoặc yyyy/mm => yyyy-mm-01
    if (/^\d{4}[-/]\d{2}$/.test(date)) {
      const [year, month] = date.split(/[-\/]/);
      return moment(`${year}-${month}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    // yyyy => yyyy-01-01
    if (/^\d{4}$/.test(date)) {
      return moment(`${date}-01-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    // Các format còn lại
    return moment(date, ['YYYY-MM-DD', 'DD/MM/YYYY', 'DD-MM-YYYY', 'MM/YYYY', 'MM-YYYY']).format('YYYY-MM-DD');
  };

  // Chuyển đổi dữ liệu sang format API mới
  const dataToSend = {
    name: cvData.name,
    birthday: formatDate(cvData.birthday || cvData.birthDay || ''),
    gender: cvData.gender,
    phoneNumber: cvData.phoneNumber || cvData.phone || '',
    address: cvData.address,
    title: cvData.title,
    templateId: cvData.templateId,
    content: cvData.content,
    isPublic: cvData.isPublic,
    photoCard: cvData.photoCard,
    sections: Array.isArray(cvData.sections)
      ? cvData.sections.map(s => ({
          sectionType: s.sectionType,
          title: s.title,
          content: s.content,
          isVisible: s.isVisible !== undefined ? s.isVisible : true,
        }))
      : [],
    skills: Array.isArray(cvData.skills)
      ? cvData.skills.map(sk => ({
          skillName: sk.skillName || sk.name,
          category: sk.category || '',
          proficiencyLevel: sk.proficiencyLevel || 0,
          proficiencyType: sk.proficiencyType || '',
        }))
      : [],
    experiences: Array.isArray(cvData.experiences || cvData.experience)
      ? (cvData.experiences || cvData.experience).map(exp => ({
          jobTitle: exp.jobTitle || exp.position || '',
          companyName: exp.companyName || exp.company || '',
          startDate: formatDate(exp.startDate || ''),
          endDate: formatDate(exp.endDate || ''),
          description: exp.description || exp.desc || '',
        }))
      : [],
    educations: Array.isArray(cvData.educations || cvData.education)
      ? (cvData.educations || cvData.education).map(ed => ({
          institutionName: ed.institutionName || ed.school || '',
          degree: ed.degree || '',
          fieldOfStudy: ed.fieldOfStudy || ed.major || '',
          startDate: formatDate(ed.startDate || ''),
          endDate: formatDate(ed.endDate || ''),
          description: ed.description || ed.desc || '',
        }))
      : [],
    certifications: Array.isArray(cvData.certifications || cvData.certificate)
      ? (cvData.certifications || cvData.certificate).map(cert => ({
          name: cert.name || '',
          issueDate: formatDate(cert.issueDate || cert.startDate || ''),
          expiryDate: cert.expiryDate ? formatDate(cert.expiryDate) : null,
        }))
      : [],
    languages: Array.isArray(cvData.languages)
      ? cvData.languages.map(lang => ({
          languageName: lang.languageName || lang.name || '',
          proficiencyLevel: lang.proficiencyLevel || '',
          certification: lang.certification || '',
        }))
      : [],
  };

  const formData = new FormData();
  formData.append('jsonCvData', JSON.stringify(dataToSend));
  if (photoCardFile) {
    formData.append('photoCard', photoCardFile as any);
  }

  // Log dữ liệu chuẩn hóa ra console
  console.log('CV data gửi lên:', dataToSend);

  try {
    const res = await apiClient.post('/Cv/create-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
