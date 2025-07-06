import { BadRequestException, Injectable } from '@nestjs/common';
import { ResumeDto } from './dtos/resume.dto';
import * as PdfParse from 'pdf-parse';
import { GptService } from './gpt.service';

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
    const json: any = await this.gptService.extractResumeData(text);
    if (json?.error) {
      throw new BadRequestException(json.error);
    }
    return json;

    //send this text as a query to gpt4.1
    //gpt returns the json version of the information
    //use class transformer to change this to an instance that can be saved to database
    //save to database
  }
}
