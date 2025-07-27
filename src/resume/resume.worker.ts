import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserInputError } from 'src/errors/user-input-error';
import { ResumeService } from './resume.service';
import { MailerService } from 'src/mailer/mailer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Processor('process-resume')
export class ResumeConsumer extends WorkerHost {
  constructor(
    private resumeService: ResumeService,
    private mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { body, file, userId } = job.data;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await this.resumeService.handleResume(body, file, userId);

      // Get user details from DB
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        console.warn(`User with ID ${userId} not found. Skipping email.`);
        return {
          message: 'Resume processed but user not found',
          id: result.id,
        };
      }
      // Send confirmation email
      await this.mailerService.sendEmail({
        receipients: [
          {
            name: user.name,
            address: user.email,
          },
        ],

        subject: 'Your Resume Has Been Successfully Received',
        html: `
        <h1>Hello ${user.name || 'there'},</h1>
        <p>We're excited to inform you that your resume has been successfully uploaded and securely stored in our <strong>IntelliScout</strong> system.</p>
        <p>Your information is now under review by our recruitment experts. If we need any additional details, we will reach out via email.</p>
        <br/>
        <p>Thank you for trusting IntelliScout.</p>
        <p>Best regards,<br/>The IntelliScout Team</p>
      `,
      });
      return { message: 'Resume processed', id: result.id };
    } catch (err) {
      console.log('message didnt get sent');
      if (err instanceof UserInputError) {
        console.warn(`Non-retriable user error: ${err.message}`);
        return { error: err.message };
      }

      throw err;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Completed job ${job.id} of type ${job.name}`);
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.log(
      `Failed job. Attempt: ${job.attemptsMade} with it: ${job.id} of type ${job.name}. Error: ${err.message}...`,
    );
  }
}

// if (body.resumeName === 'trigger-system-error') {
//         throw new Error('Simulated system failure');
//       }
