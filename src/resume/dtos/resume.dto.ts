import { IsMimeType, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Express } from 'express';

export class ResumeDto {
  @IsOptional()
  @IsString()
  resumeText?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMimeType()
  resumeFile?: Express.Multer.File;
}
