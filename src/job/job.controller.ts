import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JobService } from './job.service';
import { GetJobsDto } from './dtos/job-query-params.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobsService: JobService) {}
  @Get('/:resumeId/')
  @UsePipes(new ValidationPipe({ transform: true })) // Enables type conversion and validation
  async getJobs(
    @Param('resumeId') resumeId: string,
    @Query() query: GetJobsDto,
  ) {
    return this.jobsService.getJobs(resumeId, query);
  }
}
