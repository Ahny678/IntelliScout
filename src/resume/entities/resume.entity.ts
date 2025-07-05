import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.resumes)
  user: User;

  @Column({ nullable: true })
  currentJobTitle: string;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column('simple-array', { nullable: true })
  skills: string[]; // e.g., ['React', 'Node.js', 'SQL']

  @Column({ nullable: true })
  highestEducationLevel: string; // e.g., 'Bachelors', 'Masters', 'PhD'

  @Column('simple-json', { nullable: true })
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: number;
  }[];

  @Column('simple-json', { nullable: true })
  workExperience: {
    title: string;
    company: string;
    startYear: number;
    endYear?: number;
    industry?: string;
  }[];

  @Column('simple-array', { nullable: true })
  certifications: string[]; // e.g., ['AWS Certified Developer']

  @Column({ nullable: true })
  preferredJobLocation: string;

  @Column({ nullable: true })
  desiredSalary: number;
}
