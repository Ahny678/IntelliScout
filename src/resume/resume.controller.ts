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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { OpenResumeDto } from './dtos/OpenAPI/text-file.dto';
import { ResumeResponseDto } from './dtos/OpenAPI/get-resumes.dto';

/**
 * Handles resume routes
 */
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(
    readonly resumeService: ResumeService,
    @InjectQueue('process-resume') private resumeQueue: Queue,
  ) {}
  /**
   * Create Diary entry
   *
   * @remarks Collects resume information or cv.
   * @returns The resume object
   * @throws {401} Unauthorized — user not authenticated
   * @throws {500} Internal Server Error
   */
  @Post()
  @UseInterceptors(FileInterceptor('resumeFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload resume information OR cv. DO NOT upload both',
    type: OpenResumeDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Resume submitted for processing. If successful, mail will be sent. Else, wrong input data',
  })
  @ApiResponse({ status: 400, description: 'Bad Request — invalid diary data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — user not authenticated',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
        ' Resume submitted for processing. If successful, mail will be sent. Else, wrong input data',
    };
  }

  /**
   * Get all resumes
   *
   * @remarks Gets all resumes submitted by a user.
   * @returns List of resumes
   * @throws {401} Unauthorized — user not authenticated
   * @throws {500} Internal Server Error
   */
  @Get()
  async getAllResumes(
    @Req() req: AuthenticatedRequest,
  ): Promise<ResumeResponseDto[]> {
    const userId = req.user.id;
    const resumes = await this.resumeService.getAllResumes(userId);
    return resumes;
  }

  /**
   * Get a resume
   *
   * @remarks Gets details of a specific resume.
   * @returns Resume details
   * @throws {401} Unauthorized — user not authenticated
   * @throws {500} Internal Server Error
   */
  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: 'insert resume id...' })
  async getResumeDetails(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResumeResponseDto> {
    const userId = req.user.id;
    const resumeDetails = await this.resumeService.getResumeDetails(id, userId);
    return resumeDetails;
  }

  /**
   * Update a resume
   *
   * @remarks Update details of a specific resume.
   * @returns Resume updated details
   * @throws {401} Unauthorized — user not authenticated
   * @throws {500} Internal Server Error
   */
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, example: 'insert resume id...' })
  async updateResumeDetails(
    @Param('id') id: string,
    @Body() body: UpdateResumeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResumeResponseDto> {
    const userId = req.user.id;
    const newResume = this.resumeService.updateResumeDetails(id, body, userId);
    return newResume;
  }

  /**
   * Delete a resume
   *
   * @remarks Deletes a resume from the database
   * @throws {401} Unauthorized — user not authenticated
   * @throws {500} Internal Server Error
   */
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: 'insert resume id...' })
  async destroyResume(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    await this.resumeService.destroyResume(id, userId);
  }
}
