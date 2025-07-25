import { Module } from '@nestjs/common';

import { TypeOrmConfigModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResumeModule } from './resume/resume.module';
import { JobModule } from './job/job.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 60 * 24 * 7, // 1 week
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmConfigModule,
    AuthModule,
    UsersModule,
    ResumeModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
