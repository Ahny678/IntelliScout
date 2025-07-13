import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  EducationEntry,
  WorkEntry,
} from 'src/resume/interfaces/entry.interface';

export class ResumeResponseDto {
  /**
   * Id of resume
   * @example "ud3u88ujf83292...."
   */

  id: string;

  /**
   * Name of resume
   * @example "My First Resume...."
   */

  name: string;

  /**
   * Job title of resume
   * @example "Human Resources Business Partner"
   */

  @ApiPropertyOptional()
  currentJobTitle?: string;

  /**
   * User's years of experience in the field
   * @example "5"
   */

  @ApiPropertyOptional()
  yearsOfExperience?: number;

  /**
   * Id of user
   * @example "[Hiring, Counseling, Leadership, Public Speaking]"
   */

  @ApiPropertyOptional()
  skills?: string[];

  /**
   * User's education level
   * @example "College"
   */

  @ApiPropertyOptional()
  highestEducationLevel?: string;

  /**
   * User's Education
   * @example "Computer Science"
   */

  @ApiPropertyOptional()
  education?: EducationEntry[];

  /**
   * User's Work experience
   * @example " [{"title": "Business Consultant", "company": "MS", "startYear": 2021, "endYear": 2023, "industry": "Marketing"},]"
   */

  @ApiPropertyOptional()
  workExperience?: WorkEntry[];

  /**
   * Certficates
   * @example "HP Life Problem Solver"
   */

  @ApiPropertyOptional()
  certifications?: string[];

  /**
   * Salary goal
   * @example "500k"
   */

  @ApiPropertyOptional()
  desiredSalary?: number;
}
