import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { Response, Request } from 'express';

import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Tokens } from './types';
import { RegiserUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: RegiserUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const data = await this.authService.signupLocal(dto);
    console.log(111);
    const { refresh_token } = data;

    console.log(refresh_token);
    // thiet lap cookie cho trinh duyet
    res.cookie('token', refresh_token);
    return data;
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signinpLocal(dto);
    console.log(111);
    const { refresh_token } = data;
    console.log(refresh_token);
    // xoa token cu neu co
    res.cookie('token', '');
    // thiet lap cookie cho trinh duyet
    res.cookie('token', refresh_token);
    return {
      data: data,
    };
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    // xoa cookie di
    res.cookie('token', '');
    const data = await this.authService.logout(userId);
    return {
      data: data,
    };
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshtoken(
    @GetCurrentUserId('sub') userId: string,
    @GetCurrentUser() refreshToken: string,
    @Req() req: Request,
  ) {
    console.log(userId);
    console.log(refreshToken);
    const user = req.user['data']['sub'];
    const token = req.cookies.token;
    const data = this.authService.refreshTokens(Number(user), token);
    return {
      data: data,
    };
  }

  @Get('/profile')
  getprofileUser(@Req() req: Request) {
    console.log(1111);
    return req.user;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AtGuard, RolesGuard)
  @Get('myname')
  getMyName(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }
  @Public()
  @Get('/reset-password/:email')
  async sendMailtoResetPassword(@Param('email') email: string) {
    console.log(email);
    const data = this.authService.sendEmailchangePassword(email);
    return {
      data,
    };
  }
  @Public()
  @Put('reset/:id')
  async changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ) {
    const data = this.authService.changePassword(Number(id), password);
    return {
      data,
    };
  }
}
