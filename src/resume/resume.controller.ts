import { Controller, Post } from '@nestjs/common';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(resumeService: ResumeService) {}
  @Post('save-info')
  async saveInfo() {
    //collect text.
    //  if it is in a file, extract the file to text
    //send this text as a query to gpt4.1
    //gpt returns the json version of the information
    //use class transformer to change this to an instance that can be saved to database
    //save to database
  }
}
