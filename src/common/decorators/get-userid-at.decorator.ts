import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserIdByAT = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user[data];
  },
);
