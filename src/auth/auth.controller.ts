import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dtos/auth.dto';
import { SignupDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dtos/OpenAPIResponse/userResponse.dto';
import { LoginResponseDto } from './dtos/OpenAPIResponse/loginResponse.dto';

@Controller('auth')
/**
 * Handles authentication routes
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Create a new user account
   *
   * @remarks Registers a new user with email and password.
   * @returns The created user object.
   * @throws {400} Validation failed — invalid email or password.
   */
  @Post('signup')
  async signup(@Body() data: SignupDto): Promise<UserResponseDto> {
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
  login(@Body() authPayload: AuthPayloadDto): Promise<LoginResponseDto> {
    return this.authService.validateUser(authPayload);
  }
}
