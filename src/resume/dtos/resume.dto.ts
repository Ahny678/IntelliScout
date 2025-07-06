import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResumeDto {
  @IsString()
  @IsNotEmpty()
  resumeName: string;

  @IsString()
  @IsOptional()
  resumeText?: string;
}
