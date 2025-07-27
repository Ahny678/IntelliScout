import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { GptService } from './gpt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { BullModule } from '@nestjs/bullmq';
import { ResumeConsumer } from './resume.worker';
import { MailerModule } from 'src/mailer/mailer.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, User]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: true,
      },
    }),
    BullModule.registerQueue({
      name: 'process-resume',
    }),
    MailerModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService, GptService, ResumeConsumer],
})
export class ResumeModule {}
