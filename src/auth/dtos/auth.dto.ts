import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for login payload
 */
export class AuthPayloadDto {
  /**
   * User's email address
   * @example 'ahny@coders.com'
   */
  @IsEmail()
  email: string;

  /**
   * User's password
   * @example 'yuriGenreAlways'
   */
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
