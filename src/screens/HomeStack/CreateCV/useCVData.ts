import { useState, useCallback } from 'react';
import { Activity, Skill, UserProfile, Sections, Certificate, Education, Experience } from './typeCV';

export function useCVData() {
  // Từng trường riêng lẻ cho userProfile
  const [careerGoal, setCareerGoal] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [certificate, setCertificate] = useState<Certificate[]>([]);
  const [award, setAward] = useState<Sections[]>([]);
  const [skill, setSkill] = useState<Skill[]>([]);
  const [reference, setReference] = useState<Sections[]>([]);
  const [hobby, setHobby] = useState<Sections[]>([]);
  const [sections, setSections] = useState<Sections[]>([]);

  // Hàm cập nhật từng section
  const updateSection = useCallback((sectionKey, data) => {
    switch (sectionKey) {
      case 'careerGoal':
        setCareerGoal(Array.isArray(data) ? data[0]?.careerGoal || '' : data.careerGoal || '');
        break;
      case 'education':
        setEducation(Array.isArray(data) ? data : [data]);
        break;
      case 'experience':
        setExperience(Array.isArray(data) ? data : [data]);
        break;
      case 'activity':
        setActivity(Array.isArray(data) ? data : [data]);
        break;
      case 'certificate':
        setCertificate(Array.isArray(data) ? data : [data]);
        break;
      case 'award':
        setAward(Array.isArray(data) ? data : [data]);
        break;
      case 'skill':
        setSkill(Array.isArray(data) ? data : [data]);
        break;
      case 'reference':
        setReference(Array.isArray(data) ? data : [data]);
        break;
      case 'hobby':
        setHobby(Array.isArray(data) ? (data[0]?.hobby || '') : (data.hobby || ''));
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
        setPosition(data?.position || '');
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
        setPosition(cardData.position || '');
        break;
      }
      default:
        break;
    }
  }, []);

  // Lấy toàn bộ data CV
  const getCVData = useCallback(() => {
    // Các trường thuộc typeCV
    const userProfile = {
      name,
      position,
      birthday,
      gender,
      phone,
      email,
      website,
      address,
    };
    // Các sections động
    return {
      ...userProfile,
      education,
      experience,
      activity,
      certificate,
      skill,
      sections,
    };
  }, [name, position, birthday, gender, phone, email, website, address, careerGoal, education, experience, activity, certificate, award, skill, reference, hobby]);

  return {
    name,
    position,
    birthday,
    gender,
    phone,
    email,
    website,
    address,
    careerGoal,
    education,
    experience,
    activity,
    certificate,
    award,
    skill,
    reference,
    hobby,
    updateSection,
    getCVData,
  };
}
