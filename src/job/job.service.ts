import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from 'src/resume/entities/resume.entity';
import { Repository } from 'typeorm';

import axios from 'axios';
import { JobApiResponse } from './interfaces/job-interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    private configService: ConfigService,
  ) {}
  async getJobs(resumeId: string) {
    const params = await this.prepareParams(resumeId);
    const apiKey = this.configService.get<string>('RAPID_API_KEY')!;
    const apiUrl = this.configService.get<string>('RAPID_API_URL')!;
    const apiHost = this.configService.get<string>('RAPID_API_HOST')!;
    const response = await axios.get<JobApiResponse>(apiUrl, {
      params,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    return response.data;
  }
  async prepareParams(resumeId: string) {
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const queryParts: string[] = [];

    if (resume.currentJobTitle) queryParts.push(resume.currentJobTitle);
    if (resume.skills?.length) queryParts.push(resume.skills.join(' '));
    if (resume.preferredJobLocation)
      queryParts.push(`in ${resume.preferredJobLocation}`);

    const query = queryParts.join(' ');

    const params = {
      query,
      page: '1',
      num_pages: '1',
      country: 'us',
      date_posted: 'week',
    };
    return params;
  }
}
