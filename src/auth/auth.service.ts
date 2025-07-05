import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dtos/auth.dto';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dtos/signup.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(data: SignupDto) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const user = await this.userService.createuser(data);
    console.log(`user created:`, user);
    return user;
  }

  async validateUser({ email, password }: AuthPayloadDto) {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) {
      //return null;
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      //return null;
      throw new UnauthorizedException('Invalid password');
    }

    // Prepare the payload for JWT
    const payload = {
      name: existingUser.name,
      email: existingUser.email,
      id: existingUser.id,
    };

    // Sign and return the JWT token
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  }
}
