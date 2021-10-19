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

  get(type: 'LOGIN' | 'userID', payload: { login?: string; id?: string }) {
    if (type === 'LOGIN') {
      if (!payload.login) return null;
      return this.userRepository.findOne({ where: { login: payload.login } });
    }

    if (type === 'userID') {
      return this.userRepository.findOne(payload.id);
    }

    return null;
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
