import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeDto } from './dtos/resume.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UpdateResumeDto } from './dtos/update-resume.dto';

@UseGuards(AuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(
    readonly resumeService: ResumeService,
    @InjectQueue('process-resume') private resumeQueue: Queue,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('resumeFile'))
  async saveInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ResumeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    await this.resumeQueue.add('transform', {
      userId,
      body,
      file,
    });
    return {
      message:
        ' Resume submitted for processing. If successyul, mail will be sent. Else, wrong input data',
    };
  }

  @Get()
  async getAllResumes(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const resumes = await this.resumeService.getAllResumes(userId);
    return resumes;
  }

  @Get(':id')
  async getResumeDetails(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const resumeDetails = await this.resumeService.getResumeDetails(id, userId);
    return resumeDetails;
  }

  @Patch(':id')
  async updateResumeDetails(
    @Param('id') id: string,
    @Body() body: UpdateResumeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const newResume = this.resumeService.updateResumeDetails(id, body, userId);
    return newResume;
  }

  @Delete(':id')
  async destroyResume(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    await this.resumeService.destroyResume(id, userId);
  }
}
