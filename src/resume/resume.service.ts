import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ResumeService {
  constructor(
    private readonly gptService: GptService,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
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
}
