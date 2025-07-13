import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for login payload
 */
export class AuthPayloadDto {
  /**
   * User's email address
   * @example 'yuji@jujutsu.com'
   */
  @IsEmail()
  email: string;

  /**
   * User's password
   * @example 'InfinitVoid'
   */
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
