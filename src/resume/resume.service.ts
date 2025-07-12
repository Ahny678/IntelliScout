import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ResumeDto } from './dtos/resume.dto';
import * as PdfParse from 'pdf-parse';
import { GptService } from './gpt.service';
import { ResumeDataResult } from './interfaces/resume-json.interface';
import { plainToInstance } from 'class-transformer';
import { Resume } from './entities/resume.entity';
import { validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputError } from 'src/errors/user-input-error';
import { UpdateResumeDto } from './dtos/update-resume.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ResumeService {
  constructor(
    private readonly gptService: GptService,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async handleResume(
    body: ResumeDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    try {
      let text = '';
      if (body.resumeText) {
        text = body.resumeText;
      } else if (file) {
        const dataBuffer = file.buffer;
        const parsed = await PdfParse(dataBuffer);
        text = parsed.text;
      }
      const json: ResumeDataResult =
        await this.gptService.extractResumeData(text);
      if ('error' in json) {
        throw new UserInputError(json.error);
      }
      const preRes = {
        ...json,
        user: plainToInstance(User, { id: userId }),
        name: body.resumeName,
      };
      const resumeEntity = plainToInstance(Resume, preRes, {
        enableImplicitConversion: true,
      });

      const errors = await validate(resumeEntity);
      if (errors.length > 0) {
        console.error(errors);
        throw new UserInputError('Validation failed');
      }
      const newResume = await this.resumeRepository.save(resumeEntity);
      return newResume;
    } catch (err) {
      if (err instanceof UserInputError) {
        throw err;
      }
      throw err;
    }
  }

  async getAllResumes(userId: string) {
    const resumes = await this.resumeRepository.find({
      where: { user: { id: userId } },
    });
    return resumes;
  }

  async getResumeDetails(id: string, userId: string) {
    const resumeDetails = await this.resumeRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!resumeDetails) {
      throw new NotFoundException(
        'Resume with such id does not exist OR you do not own this resource',
      );
    }
    return resumeDetails;
  }

  async updateResumeDetails(id: string, body: UpdateResumeDto, userId: string) {
    const resume = await this.resumeRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found or access denied');
    }

    Object.assign(resume, body);
    //delete the cache
    const cacheKey = `jobs:${resume.id}`;

    await this.cacheManager.del(cacheKey);

    return this.resumeRepository.save(resume);
  }

  async destroyResume(id: string, userId: string) {
    const resume = await this.resumeRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found or access denied');
    }
    //delete the cache
    const cacheKey = `jobs:${resume.id}`;
    await this.cacheManager.del(cacheKey);
    await this.resumeRepository.remove(resume);
  }
}
