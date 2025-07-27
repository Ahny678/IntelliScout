/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dtos/send-email.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private mailTransport(): Transporter {
    return nodemailer.createTransport({
      host: this.configService.get<string>('PROD_MAIL_HOST'),
      port: Number(this.configService.get<string>('PROD_MAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('PROD_MAIL_USER'),
        pass: this.configService.get<string>('PROD_MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(
    data: SendEmailDto,
  ): Promise<{ success: boolean; messageId: string } | void> {
    const { from, receipients, subject, html } = data;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from:
        from ??
        ({
          name: this.configService.get<string>('APP_NAME')!,
          address: this.configService.get<string>('DEF_MAIL_FROM')!,
        } as Mail.Address),
      to: receipients,
      subject,
      html,
    };

    try {
      const info: SentMessageInfo = await transport.sendMail(options);
      console.log('Email sent: ', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Failed to send email:', err.message);
      } else {
        console.error('Unexpected error occurred:', err);
      }
    }
  }
}
