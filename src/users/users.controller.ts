import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor() {}
  @Post('test')
  doTest() {
    return 'a test';
  }
}
