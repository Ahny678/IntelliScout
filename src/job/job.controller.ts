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
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JobResponseDto } from './dtos/OpenAPI/get-job.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobsService: JobService) {}
  @ApiParam({
    name: 'resumeId',
    required: true,
    example: 'insert resume id...',
  })
  @ApiOkResponse({
    description: 'List of matching jobs for the provided resume',
    type: [JobResponseDto],
  })
  @Get('/:resumeId/')
  @UsePipes(new ValidationPipe({ transform: true })) // Enables type conversion and validation
  async getJobs(
    @Param('resumeId') resumeId: string,
    @Query() query: GetJobsDto,
  ) {
    return this.jobsService.getJobs(resumeId, query);
  }
}
