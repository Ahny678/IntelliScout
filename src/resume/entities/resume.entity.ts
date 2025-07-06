import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EducationEntry, WorkEntry } from '../interfaces/entry.interface';
@Entity()
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.resumes)
  user: User;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  currentJobTitle: string;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  yearsOfExperience: number;

  @IsOptional()
  @IsArray()
  @Column('simple-array', { nullable: true })
  skills: string[];

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  highestEducationLevel: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntry)
  @Column('simple-json', { nullable: true })
  education: EducationEntry[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkEntry)
  @Column('simple-json', { nullable: true })
  workExperience: WorkEntry[];

  @IsOptional()
  @IsArray()
  @Column('simple-array', { nullable: true })
  certifications: string[];

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  preferredJobLocation: string;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  desiredSalary: number;
}
