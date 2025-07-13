import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum JobType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

export class GetJobsDto {
  /**
   * Desired Location
   * @example "europe"
   */
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  location: string;

  /**
   * Number of results to return
   * @example 3
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  results_wanted: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  distance: number;

  @IsOptional()
  @IsEnum(JobType, {
    message: 'job_type must be one of: remote, onsite, hybrid',
  })
  @ApiPropertyOptional()
  job_type: JobType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional()
  is_remote: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional()
  linkedin_fetch_description: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  hours_old: number;
}
