import { BadRequestException, Injectable } from '@nestjs/common';
import { ResumeDto } from './dtos/resume.dto';
import * as PdfParse from 'pdf-parse';
import { GptService } from './gpt.service';
import { ResumeDataResult } from './interfaces/resume-json.interface';
import { plainToInstance } from 'class-transformer';
import { Resume } from './entities/resume.entity';
import { validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ResumeService {
  constructor(private readonly gptService: GptService) {}
  async handleResume(
    body: ResumeDto,
    file: Express.Multer.File,
    userId: string,
  ) {
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
      throw new BadRequestException(json.error);
    }
    // const preRes = { ...json, user: { id: userId }, name: body.resumeName };
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
      throw new Error('Validation failed');
    }
    // await this.resumeRepository.save(resumeEntity);
    return resumeEntity;
    //save to database
    //send email of success
    //implement rabbitmq queues
  }
}
