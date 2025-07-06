import { IsEmail, IsString } from 'class-validator';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;
  @IsString()
  @Column()
  name: string;
  @IsEmail()
  @Column()
  email: string;
  @IsString()
  @Column()
  password: string;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: [Resume];
}
