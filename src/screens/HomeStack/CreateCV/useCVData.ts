import { useState, useCallback } from 'react';
import {
  CareerGoal,
  Education,
  Experience,
  Activity,
  Certificate,
  Award,
  Skill,
  Reference,
  Hobby,
  UserProfile,
} from './typeCV';

export function useCVData() {
  // Định nghĩa type cho userProfile để có name, position
  type UserProfileType = {
    name?: string;
    position?: string;
    [key: string]: any;
  };
  const [userProfile, setUserProfile] = useState<UserProfileType>({});
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('');
  const [education, setEducation] = useState<Education>({});
  const [experience, setExperience] = useState<Experience>({});
  const [activity, setActivity] = useState<Activity>({});
  const [certificate, setCertificate] = useState<Certificate>({});
  const [award, setAward] = useState<Award>({});
  const [skill, setSkill] = useState<Skill>({});
  const [reference, setReference] = useState<Reference>({});
  const [hobby, setHobby] = useState<Hobby>('');

  // Hàm cập nhật từng section
  const updateSection = useCallback((sectionKey, data) => {
    switch (sectionKey) {
      case 'careerGoal':
        setCareerGoal(Array.isArray(data) ? data[0]?.careerGoal || '' : data.careerGoal || '');
        break;
      case 'education':
        setEducation(data);
        break;
      case 'experience':
        setExperience(data);
        break;
      case 'activity':
        setActivity(data);
        break;
      case 'certificate':
        setCertificate(data);
        break;
      case 'award':
        setAward(data);
        break;
      case 'skill':
        // Nếu data là mảng, lấy phần tử đầu tiên
        if (Array.isArray(data)) {
          setSkill(data[0] || {});
        } else {
          setSkill(data || {});
        }
        break;
      case 'reference':
        if (Array.isArray(data)) {
          setReference(data[0] || {});
        } else {
          setReference(data || {});
        }
        break;
      case 'hobby':
        // Nếu data là mảng, lấy hobby từ phần tử đầu tiên
        if (Array.isArray(data)) {
          setHobby(data[0]?.hobby || '');
        } else {
          setHobby(data.hobby || '');
        }
        break;
      case 'userProfile': {
        // Luôn chỉ lấy duy nhất 1 bản ghi
        let profileObj = {};
        if (Array.isArray(data)) {
          profileObj = { ...data[0] };
        } else {
          profileObj = { ...data };
        }
        const { name, position, ...rest } = profileObj as UserProfileType;
        setUserProfile({ ...rest });
        break;
      }
      case 'card': {
        // Luôn chỉ lấy duy nhất 1 bản ghi
        let cardData = data;
        if (Array.isArray(data)) {
          cardData = data[0];
        }
        setUserProfile(prev => ({
          ...prev,
          name: cardData.name,
          position: cardData.position
        }));
        break;
      }
      default:
        break;
    }
  }, []);

  // Lấy toàn bộ data CV
  const getCVData = useCallback(() => ({
    userProfile,
    careerGoal,
    education,
    experience,
    activity,
    certificate,
    award,
    skill,
    reference,
    hobby,
  }), [userProfile, careerGoal, education, experience, activity, certificate, award, skill, reference, hobby]);

  return {
    userProfile,
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
