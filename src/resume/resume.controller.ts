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

@UseGuards(AuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(readonly resumeService: ResumeService) {}
  @Post('save-info')
  @UseInterceptors(FileInterceptor('resumeFile'))
  async saveInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ResumeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return await this.resumeService.handleResume(body, file, userId);
  }
}
