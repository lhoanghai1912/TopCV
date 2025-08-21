export type UserProfile = {
  name?: string;
  content?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
};

export type Education = {
  institutionName?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type EducationList = Education[];

export type Experience = {
  jobTitle?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type ExperienceList = Experience[];

export type Activity = {
  startDate?: string;
  endDate?: string;
  organization?: string;
  position?: string;
  description?: string;
};

export type ActivityList = Activity[];

export type Certificate = {
  name?: string;
  issueDate?: string;
  expiryDate?: string;
};

export type CertificateList = Certificate[];

export type Skill = {
  skillName?: string;
  category?: string;
  proficiencyLevel?: number;
  proficiencyType?: string;
};

export type SkillList = Skill[];

export type Sections = {
  sectionType?: string;
  title?: string;
  content?: string;
  records?: Record<string, any>[]; // Thêm support cho nhiều records
  isVisible?: boolean;
};
export type SectionsList = Sections[];

export type Award = {
  name?: string;
  time?: string;
};
