/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable } from '@nestjs/common';
import { AzureKeyCredential } from '@azure/core-auth';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { promptText } from './prompt/prompt';
import * as dotenv from 'dotenv';
import { ResumeDataResult } from './interfaces/resume-json.interface';

dotenv.config();

@Injectable()
export class GptService {
  private client;
  private model = 'openai/gpt-4.1';

  constructor() {
    const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
    const token = process.env['AZURE_OPENAI_KEY'];
    if (!endpoint || !token) {
      throw new Error('No auth');
    }
    this.client = ModelClient(endpoint, new AzureKeyCredential(token));
  }

  async extractResumeData(text: string): Promise<ResumeDataResult> {
    const prompt = `${promptText}\n\n${text}`;

    const response = await this.client.path('/chat/completions').post({
      body: {
        messages: [
          {
            role: 'system',
            content: `You are a resume parser. Your job is to extract structured resume data from plain text and return valid JSON.
If no resume-like information is found (e.g. no name, experience, or skills), return a JSON response like: {"error": "No resume data found"}.
Do not return plain text or explanations outside of JSON.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        top_p: 1,
        model: this.model,
      },
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const jsonString = response.body.choices[0].message.content;

    try {
      console.log(text);
      console.log('Raw GPT response:', jsonString);
      return JSON.parse(jsonString) as ResumeDataResult;
    } catch (e) {
      console.log(e);
      throw new Error('Failed to parse GPT response as JSON:');
    }
  }
}
