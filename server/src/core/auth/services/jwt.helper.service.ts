import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class JwtHelperService {
  constructor(private jwtService: JwtService) {}

  private getTokenData(type: 'ACCESS' | 'REFRESH') {
    if (type === 'ACCESS') {
      return {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
        expiresIn: process.env.JWT_ACCESS_SECRET_TIME,
      };
    }
    if (type === 'REFRESH') {
      return {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_SECRET_TIME,
      };
    }
  }

  create(type: 'ACCESS' | 'REFRESH', payload: jwtPayloadType = {}) {
    const jwtConfig = this.getTokenData(type);

    return this.jwtService.sign(payload, { ...jwtConfig });
  }

  verify(type: 'ACCESS' | 'REFRESH', token: string) {
    try {
      const jwtConfig = this.getTokenData(type);

      return this.jwtService.verify(token, { secret: jwtConfig.secret });
    } catch (error) {
      throw error;
    }
  }
}
