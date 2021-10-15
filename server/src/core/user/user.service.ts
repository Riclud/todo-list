import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getByLogin(login: string) {
    return this.userRepository.findOne({ where: { login } });
  }

  getByID(id: string) {
    return this.userRepository.findOne(id);
  }

  create(login: string, password: string) {
    return this.userRepository.insert({ login, password });
  }

  update(id: string, updateConfig: { login?: string; password?: string }) {
    return this.userRepository.update(id, { ...updateConfig });
  }

  deleteByID(id: string) {
    return this.userRepository.delete(id);
  }
}
