import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  /**
   * User's name
   * @example 'Maki Zenin'
   */
  @IsNotEmpty()
  name: string;

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
