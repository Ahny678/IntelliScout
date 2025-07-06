// resume-data.interface.ts

export interface ResumeEducation {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
}

export interface ResumeWorkExperience {
  title: string;
  company: string;
  startYear: number;
  endYear: number;
  industry: string;
}

export interface ResumeData {
  name: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  skills: string[];
  highestEducationLevel: string;
  education: ResumeEducation[];
  workExperience: ResumeWorkExperience[];
  certifications: string[];
  preferredJobLocation: string;
  desiredSalary: number;
}

export type ResumeDataResult = ResumeData | { error: string };
