import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('process-resume')
export class ResumeConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(
      `Failed job. Attempt: ${job.attemptsMade} with it: ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
