import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum JobType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

export class GetJobsDto {
  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  results_wanted: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  distance: number;

  @IsOptional()
  @IsEnum(JobType, {
    message: 'job_type must be one of: remote, onsite, hybrid',
  })
  job_type: JobType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_remote: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  linkedin_fetch_description: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  hours_old: number;
}
