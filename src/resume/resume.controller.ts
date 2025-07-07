import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeDto } from './dtos/resume.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@UseGuards(AuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(
    readonly resumeService: ResumeService,
    @InjectQueue('process-resume') private resumeQueue: Queue,
  ) {}
  @Post('save-info')
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
}
