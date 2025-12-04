export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  birthDate: string;
  birthPlace: string;
  photoUrl: string | null;
  website: string;
  linkedin: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g. "Muttersprache", "Verhandlungssicher"
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
}

export type AIOperationType = 'polish' | 'translate_to_german' | 'fix_grammar';