import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dtos/auth.dto';
import { SignupDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupDto) {
    return await this.authService.signup(data);
  }

  /**
   * Authenticate a user
   *
   * @remarks Authenticates using email and password and returns a token.
   * @returns The created token and user object payload.
   * @throws {401} Unauthorized
   */
  @Post('login')
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }
}
