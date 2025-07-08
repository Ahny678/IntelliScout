import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from 'src/resume/entities/resume.entity';
import { Repository } from 'typeorm';

import axios from 'axios';
import { JobApiResponse } from './interfaces/job-interface';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getJobs(resumeId: string) {
    const cacheKey = `jobs:${resumeId}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Hit cache');
      return cached;
    }
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
    const data = response.data;
    await this.cacheManager.set(cacheKey, data, 60 * 60 * 24 * 7);
    console.log('Hit API call');
    return data;
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
