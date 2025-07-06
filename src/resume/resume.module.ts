import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { GptService } from './gpt.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, GptService],
})
export class ResumeModule {}
