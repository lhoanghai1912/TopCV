import { useState, useCallback } from 'react';
import { Activity, Skill, UserProfile, Sections, Certificate, Education, Experience } from './typeCV';

// Helper function để format date theo chuẩn yyyy-mm-dd
const formatDateField = (dateString: string): string => {
  if (!dateString) return '';
  
  // Nếu đã đúng format yyyy-mm-dd thì trả về luôn
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  
  // Convert từ các format khác
  try {
    let date: Date | null = null;
    
    // Format dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    // Format mm/yy -> yyyy-mm-01
    else if (/^\d{2}\/\d{2}$/.test(dateString)) {
      const [month, year] = dateString.split('/');
      const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
      date = new Date(fullYear, parseInt(month) - 1, 1);
    }
    // Format yyyy-mm -> yyyy-mm-01
    else if (/^\d{4}-\d{2}$/.test(dateString)) {
      return `${dateString}-01`;
    }
    
    if (date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
  }
  
  return dateString; // Trả về nguyên bản nếu không convert được
};

export function useCVData() {
  // Title CV
  const [title, setTitle] = useState<string>('');
  // Photo Card cho CV
  const [photoCard, setPhotoCard] = useState<string>('');
  // Từng trường riêng lẻ cho userProfile
  const [careerGoal, setCareerGoal] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [educations, setEducation] = useState<Education[]>([]);
  const [experiences, setExperience] = useState<Experience[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [certificate, setCertificate] = useState<Certificate[]>([]);
  const [award, setAward] = useState<Sections[]>([]);
  const [skills, setSkill] = useState<Skill[]>([]);
  const [reference, setReference] = useState<Sections[]>([]);
  const [hobby, setHobby] = useState<Sections[]>([]);
  const [sections, setSections] = useState<Sections[]>([]);

  // Hàm cập nhật từng section
  const updateSection = useCallback((sectionKey, data) => {
    switch (sectionKey) {
      case 'title':
        setTitle(typeof data === 'string' ? data : data?.title || '');
        break;
      case 'photoCard':
        setPhotoCard(typeof data === 'string' ? data : data?.photoCard || '');
        break;
      case 'careerGoal':
        // Cập nhật cả state riêng và sections array
        let careerGoalContent = '';
        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') {
            careerGoalContent = data[0];
          } else if (typeof data[0] === 'object' && data[0]?.careerGoal) {
            careerGoalContent = data[0].careerGoal;
          }
        } else if (typeof data === 'string') {
          careerGoalContent = data;
        } else if (typeof data === 'object' && data?.careerGoal) {
          careerGoalContent = data.careerGoal;
        }
        
        setCareerGoal(careerGoalContent);
        
        // Cũng cập nhật vào sections array
        setSections(prevSections => {
          const careerGoalSection = {
            sectionType: 'careerGoal',
            title: 'Mục tiêu nghề nghiệp',
            content: careerGoalContent,
            isVisible: true,
          };
          const idx = prevSections.findIndex(s => s.sectionType === 'careerGoal');
          if (idx !== -1) {
            const updated = [...prevSections];
            updated[idx] = careerGoalSection;
            return updated;
          } else {
            return [...prevSections, careerGoalSection];
          }
        });
        break;
      case 'educations':
        setEducation(Array.isArray(data) ? data : [data]);
        break;
      case 'experiences':
        setExperience(Array.isArray(data) ? data : [data]);
        break;
      case 'activity':
      case 'award':
      case 'reference':
      case 'hobby':
      case 'careerGoal':
        // Các dynamic sections - chuyển thành section object và lưu vào sections array
        let sectionObj;
        if (Array.isArray(data)) {
          sectionObj = data[0];
        } else {
          sectionObj = data;
        }
        
        // Đảm bảo có đủ thông tin section
        if (!sectionObj?.sectionType) {
          sectionObj = {
            sectionType: sectionKey,
            title: sectionKey,
            content: typeof sectionObj === 'string' ? sectionObj : (sectionObj?.content || sectionObj?.careerGoal || sectionObj?.hobby || ''),
            isVisible: true,
          };
        }
        
        setSections(prevSections => {
          const idx = prevSections.findIndex(s => s.sectionType === sectionKey);
          if (idx !== -1) {
            const updated = [...prevSections];
            updated[idx] = { ...updated[idx], ...sectionObj };
            return updated;
          } else {
            return [...prevSections, sectionObj];
          }
        });
        
        // Cũng cập nhật state riêng cho backward compatibility
        if (sectionKey === 'careerGoal') {
          setCareerGoal(sectionObj.content || '');
        } else if (sectionKey === 'activity') {
          setActivity(Array.isArray(data) ? data : [data]);
        } else if (sectionKey === 'award') {
          setAward(Array.isArray(data) ? data : [data]);
        } else if (sectionKey === 'reference') {
          setReference(Array.isArray(data) ? data : [data]);
        } else if (sectionKey === 'hobby') {
          setHobby(sectionObj.content || '');
        }
        break;
      case 'certificate':
        setCertificate(Array.isArray(data) ? data : [data]);
        break;
      case 'skills':
        setSkill(Array.isArray(data) ? data : [data]);
        break;
      case 'sections': {
        // Add or update section in sections array
        let newSection = Array.isArray(data) ? data[0] : data;
        if (!newSection || !newSection.sectionType) break;
        setSections(prevSections => {
          // Update if exists, else add
          const idx = prevSections.findIndex(s => s.sectionType === newSection.sectionType);
          if (idx !== -1) {
            const updated = [...prevSections];
            updated[idx] = { ...updated[idx], ...newSection };
            return updated;
          } else {
            return [...prevSections, newSection];
          }
        });
        break;
      }
      case 'userProfile': {
        // Cập nhật từng trường riêng lẻ
        if (Array.isArray(data)) data = data[0];
        setName(data?.name || '');
        setContent(data?.content || '');
        setBirthday(data?.birthday || '');
        setGender(data?.gender || '');
        setPhone(data?.phone || '');
        setEmail(data?.email || '');
        setWebsite(data?.website || '');
        setAddress(data?.address || '');
        break;
      }
      case 'card': {
        let cardData = data;
        if (Array.isArray(data)) {
          cardData = data[0];
        }
        setName(cardData.name || '');
        setContent(cardData.content || '');
        break;
      }
      default:
        break;
    }
  }, []);

  // Lấy toàn bộ data CV
  const getCVData = useCallback(() => {
    // Format tất cả date fields
    const formatEducation = educations.map(edu => ({
      ...edu,
      startDate: edu.startDate ? formatDateField(edu.startDate) : '',
      endDate: edu.endDate ? formatDateField(edu.endDate) : '',
    }));

    const formatExperience = experiences.map(exp => ({
      ...exp,
      startDate: exp.startDate ? formatDateField(exp.startDate) : '',
      endDate: exp.endDate ? formatDateField(exp.endDate) : '',
    }));

    const formatActivity = activity.map(act => ({
      ...act,
      startDate: act.startDate ? formatDateField(act.startDate) : '',
      endDate: act.endDate ? formatDateField(act.endDate) : '',
    }));

    const formatCertificate = certificate.map(cert => ({
      ...cert,
      issueDate: cert.issueDate ? formatDateField(cert.issueDate) : '',
      expiryDate: cert.expiryDate ? formatDateField(cert.expiryDate) : '',
    }));

    // Các trường thuộc typeCV
    const userProfile = {
      name,
      content,
      birthday: birthday ? formatDateField(birthday) : '',
      gender,
      phone,
      email,
      website,
      address,
    };

    // Format sections có chứa date fields
    const formatSections = sections.map(section => {
      if (section.records && Array.isArray(section.records)) {
        const formattedRecords = section.records.map(record => {
          const formattedRecord = { ...record };
          
          // Format các trường date trong records
          Object.keys(formattedRecord).forEach(key => {
            if ((key.includes('date') || key.includes('Date') || key === 'time') && 
                formattedRecord[key] && typeof formattedRecord[key] === 'string') {
              formattedRecord[key] = formatDateField(formattedRecord[key]);
            }
          });
          
          return formattedRecord;
        });
        
        return {
          ...section,
          records: formattedRecords
        };
      }
      return section;
    });

    // Các sections động
    return {
      title,
      photoCard, // Thêm photoCard vào CVData
      templateId: 2, // Fixed value
      isPublic: true, // Fixed value
      ...userProfile,
      educations: formatEducation,
      experiences: formatExperience,
      activity: formatActivity,
      certifications: formatCertificate,
      skills,
      sections: formatSections,
    };
  }, [title, photoCard, name, content, birthday, gender, phone, email, website, address, careerGoal, educations, experiences, activity, certificate, award, skills, reference, hobby, sections]);

  const removeSection = useCallback((sectionType: string) => {
    setSections(prevSections => 
      prevSections.filter(section => section.sectionType !== sectionType)
    );
  }, []);

  return {
    title,
    setTitle,
    photoCard,
    setPhotoCard,
    name,
    setName,
    content,
    setContent,
    birthday,
    setBirthday,
    gender,
    setGender,
    phone,
    setPhone,
    email,
    setEmail,
    website,
    setWebsite,
    address,
    setAddress,
    careerGoal,
    educations: educations,
    setEducation,
    experience: experiences,
    setExperience,
    activity,
    setActivity,
    certificate: certificate,
    setCertificate,
    award,
    setAward,
    skills: skills,
    setSkill,
    reference,
    setReference,
    hobby,
    setHobby,
    sections,
    setSections,
    updateSection,
    removeSection,
    getCVData,
  };
}
