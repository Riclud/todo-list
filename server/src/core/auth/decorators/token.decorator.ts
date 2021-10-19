import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (tokenType: 'ACCESS' | 'REFRESH', ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    if (tokenType === 'ACCESS') {
      const token = req.headers.authorization;

      if (token && token.indexOf('Bearer ')) {
        return token.split(' ')[1];
      }
    }

    if (tokenType === 'REFRESH') {
      const token = req.cookies?.refresh_token;

      if (token) return token;
    }

    return null;
  },
);
