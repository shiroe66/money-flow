import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetToken = createParamDecorator(
  (data: 'access' | 'refresh', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (data === 'access') {
      const [_, token] = request.headers.authorization.split(' ');
      return token;
    }

    if (data === 'refresh') {
      const token = request.cookies.refresh;
      return token;
    }

    return null;
  },
);
