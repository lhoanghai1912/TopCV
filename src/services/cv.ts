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
    experiences: Array.isArray(cvData.experiences || cvData.experiences)
      ? (cvData.experiences || cvData.experiences).map(exp => ({
          jobTitle: exp.jobTitle || exp.position || '',
          companyName: exp.companyName || exp.company || '',
          startDate: formatDate(exp.startDate || ''),
          endDate: formatDate(exp.endDate || ''),
          description: exp.description || exp.desc || '',
        }))
      : [],
    educations: Array.isArray(cvData.educations || cvData.educations)
      ? (cvData.educations || cvData.educations).map(ed => ({
          institutionName: ed.institutionName || ed.school || '',
          degree: ed.degree || '',
          fieldOfStudy: ed.fieldOfStudy || ed.major || '',
          startDate: formatDate(ed.startDate || ''),
          endDate: formatDate(ed.endDate || ''),
          description: ed.description || ed.desc || '',
        }))
      : [],
    certificationss: Array.isArray(cvData.certificationss || cvData.certificate || cvData.certifications)
      ? (cvData.certificationss || cvData.certificate || cvData.certifications).map(cert => ({
          name: cert.name || '',
          issueDate: formatDate(cert.issueDate || cert.startDate || ''),
          expiryDate: cert.expiryDate ? formatDate(cert.expiryDate) : null,
        }))
      : [],
    languages: Array.isArray(cvData.languages)
      ? cvData.languages.map(lang => ({
          languageName: lang.languageName || lang.name || '',
          proficiencyLevel: lang.proficiencyLevel || '',
          certifications: lang.certifications || '',
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

// Hàm tạo CV mới dựa trên curl command
export const createCVWithImage = async (
  cvData: any,
  imageUri?: string
) => {
  try {
    const formData = new FormData();
    
    // Chuẩn bị dữ liệu CV theo format API
    const jsonCvData = {
      templateId: cvData.templateId || 2,
      isPublic: cvData.isPublic || true,
      title: cvData.title || '',
      name: cvData.name || '',
      content: cvData.content || '',
      birthday: cvData.birthday || '',
      gender: cvData.gender || '',
      phone: cvData.phone || '',
      email: cvData.email || '',
      website: cvData.website || '',
      address: cvData.address || '',
      educations: cvData.educations || [],
      experiences: cvData.experiences || [],
      activity: cvData.activity || [],
      certifications: cvData.certificate || cvData.certifications || [],
      skills: cvData.skills || [],
      sections: cvData.sections || [],
      // Nếu có ảnh thì cập nhật photoCard, nếu không thì để rỗng
      photoCard: (imageUri && imageUri.length > 0) ? cvData.photoCard || "" : ""
    };

    // Log dữ liệu CV
    console.log('=== CV DATA GỬI LÊN API ===');
    console.log('JSON CV Data:', JSON.stringify(jsonCvData, null, 2));
    console.log('PhotoCard status:', jsonCvData.photoCard ? 'Có ảnh' : 'Không có ảnh');
    
    // Append JSON data
    formData.append('jsonCvData', JSON.stringify(jsonCvData));
    
    // Nếu có ảnh thì append ảnh, nếu không thì không append images
    if (imageUri && imageUri.length > 0) {
      // Lấy tên file từ uri hoặc tạo tên mặc định
      const fileName = imageUri.split('/').pop() || 'photo-card.jpg';
      
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      } as any);
      
      console.log('Đang upload ảnh:', imageUri);
      console.log('Tên file ảnh:', fileName);
    } else {
      console.log('Không có ảnh để upload - photoCard sẽ là rỗng');
    }

    const response = await apiClient.post('/Cv/create-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('=== KẾT QUẢ TẠO CV ===');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo CV:', error);
    throw error;
  }
};
