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
