import { UserResponseDto } from './userResponse.dto';

/**
 * Response DTO for a successful login
 */
export class LoginResponseDto {
  /**
   * JWT access token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token: string;

  /**
   * Authenticated user details
   */
  user: UserResponseDto;
}
