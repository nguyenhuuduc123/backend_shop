import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { AtStratety, RtStratety } from './strategies';
import { AtGuard, RtGuard } from 'src/common/guards';
@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStratety,
    RtStratety,
    RolesGuard,
    RtGuard,
    AtGuard,
  ],
  exports: [AtStratety, RtStratety, RolesGuard, RtGuard, AtGuard],
})
export class AuthModule {}
