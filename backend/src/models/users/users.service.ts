import { RegisterDto } from '@app/auth/dto/register-dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(
    key: 'id' | 'username' | 'email',
    value: string,
  ): Promise<User> {
    const user = this.userRepository.findOne({ where: { [key]: value } });
    return user;
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    return user.save();
  }
}
