import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/* */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createuser(data: SignupDto) {
    try {
      const { name, email, password } = data;

      const hashedPassword: string = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
      });
      await this.userRepository.save(user);
      return { name, email };
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error creating user:', err.message);
      } else {
        console.error('Unknown error creating user', err);
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
