import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { GptService } from './gpt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { BullModule } from '@nestjs/bullmq';
import { ResumeConsumer } from './resume.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: { attempts: 3 },
    }),
    BullModule.registerQueue({
      name: 'process-resume',
    }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService, GptService, ResumeConsumer],
})
export class ResumeModule {}
