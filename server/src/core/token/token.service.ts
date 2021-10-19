import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtHelperService } from '../auth/services/jwt.helper.service';
import { TokenEntity } from './token.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private jwtHelperService: JwtHelperService,
  ) {}

  async create(userID: string) {
    const refresh_token_key = uuid();
    const access_token = this.jwtHelperService.create('ACCESS', { id: userID });
    const refresh_token = this.jwtHelperService.create('REFRESH', {
      refresh_token_key,
    });

    await this.tokenRepository.insert({
      access_token,
      refresh_token_key,
      userID: userID,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  delete(
    type: 'ID' | 'ACCESS_TOKEN' | 'REFRESH_KEY',
    {
      id,
      access_token,
      refresh_token_key,
    }: { id?: number; access_token?: string; refresh_token_key?: string },
  ) {
    if (type === 'ID') {
      return this.tokenRepository.delete(id);
    }

    if (type === 'ACCESS_TOKEN') {
      return this.tokenRepository.delete({ access_token });
    }
    if (type === 'REFRESH_KEY') {
      return this.tokenRepository.delete({
        refresh_token_key,
      });
    }
  }

  get(
    type: 'ID' | 'REFRESH_KEY',
    { id, refresh_token_key }: { id?: string; refresh_token_key?: string },
  ) {
    if (type === 'ID') {
      return this.tokenRepository.findOne(id);
    }

    if (type === 'REFRESH_KEY') {
      return this.tokenRepository.findOne({
        where: { refresh_token_key },
      });
    }

    return null;
  }
}
