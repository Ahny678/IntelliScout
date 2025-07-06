import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EducationEntry {
  @IsString()
  degree: string;

  @IsString()
  field: string;

  @IsString()
  institution: string;

  @IsNumber()
  graduationYear: number;
}

export class WorkEntry {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsNumber()
  startYear?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsString()
  industry?: string;
}
