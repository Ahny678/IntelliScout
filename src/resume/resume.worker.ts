import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserInputError } from 'src/errors/user-input-error';
import { ResumeService } from './resume.service';

@Processor('process-resume')
export class ResumeConsumer extends WorkerHost {
  constructor(private resumeService: ResumeService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { body, file, userId } = job.data;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await this.resumeService.handleResume(body, file, userId);
      console.log('Send sms placeholder');
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
