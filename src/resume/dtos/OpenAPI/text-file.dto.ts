import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OpenResumeDto {
  @ApiProperty({
    description: 'Resume name',
    type: 'string',
    example: 'Software dev cv',
  })
  @IsString()
  resumeName: string;
  @ApiPropertyOptional({
    description: 'Plain text version of the resume',
    type: 'string',
    example:
      'Experienced software engineer with a passion for clean code. five years experience. Skills: Java, Kotlin, React...',
  })
  @IsOptional()
  @IsString()
  resumeText?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'PDF file of the resume',
  })
  @IsOptional()
  resumeFile?: any;
}
