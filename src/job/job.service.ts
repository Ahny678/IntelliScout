import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from 'src/resume/entities/resume.entity';
import { Repository } from 'typeorm';

import axios from 'axios';
import { JobApiResponse } from './interfaces/job-interface';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetJobsDto } from './dtos/job-query-params.dto';
// import { createCacheKey } from 'src/helpers/cache-hash';
import { addMatchScores } from 'src/helpers/job-match-score';
import { isDtoEffectivelyEmpty } from 'src/helpers/isDtoEmpty';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getJobs(resumeId: string, query: GetJobsDto) {
    const isQueryEmpty = isDtoEffectivelyEmpty(query);
    console.log(`query empty? ${isQueryEmpty}`);
    const cacheKey = `jobs:${resumeId}`;
    if (isQueryEmpty) {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log('Hit cache');
        return cached;
      }
    }

    const postData = await this.preparePostBody(resumeId, query);

    const apiKey = this.configService.get<string>('RAPID_API_KEY')!;
    const apiUrl = this.configService.get<string>('RAPID_API_URL')!;
    const apiHost = this.configService.get<string>('RAPID_API_HOST')!;

    const response = await axios.post<JobApiResponse>(apiUrl, postData, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    // Enrich jobs with match scores
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    if (!resume) throw new NotFoundException('Resume not found');

    data.jobs = addMatchScores(data.jobs, resume);

    await this.cacheManager.set(cacheKey, data, 60 * 60 * 24 * 7); // cache for 7 days
    console.log('Hit API call');

    return data;
  }

  async preparePostBody(resumeId: string, query: GetJobsDto) {
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const jobTitle = resume.currentJobTitle || '';

    return {
      // search_term,
      search_term: jobTitle,
      location: query.location || 'us', // You can make this dynamic later
      results_wanted: query.results_wanted || 5,
      site_name: ['indeed', 'linkedin', 'zip_recruiter', 'glassdoor'],
      distance: query.distance || 50,
      job_type: query.job_type || 'fulltime',
      is_remote: query.is_remote || false,
      linkedin_fetch_description: query.linkedin_fetch_description || false,
      hours_old: query.hours_old || 72,
    };
  }
}
