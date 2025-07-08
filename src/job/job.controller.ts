import { Controller, Get, Param } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobsService: JobService) {}
  @Get('/:resumeId/')
  async getJobs(@Param('resumeId') resumeId: string) {
    return this.jobsService.getJobs(resumeId);
  }
}
