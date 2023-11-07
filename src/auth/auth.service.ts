import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { RegisterUserDto } from './dto/register.dto';
import { MailerService } from '@nest-modules/mailer';
import { createSuccessResponse } from 'src/config/config.response';
import { INTERNAL_MESSAGE, INTERNAL_STATUS } from 'src/constant';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async signupLocal(dto: RegisterUserDto) {
    // check user exist
    const user_check = await this.prisma.user.findUnique({
      where : {
        phoneNumber : dto.phoneNumber,
        email : dto.email
      }
    })
    if(user_check) throw new BadRequestException('user is existing')
    const hash = await this.hashData(dto.hash);
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        role: Role.USER,
        hash: hash,
      },
    });
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return createSuccessResponse(INTERNAL_STATUS.OK,INTERNAL_MESSAGE.OK,tokens);
  }

  async signInLocal(dto: AuthDto)  {
   
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new ForbiddenException('access denied');
      const passwordMatched = await bcrypt.compare(dto.password, user.hash);
      if (!passwordMatched) throw new ForbiddenException('access denied');
      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refresh_token);
    return createSuccessResponse(INTERNAL_STATUS.OK, INTERNAL_MESSAGE.OK, tokens);
  }
  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRt: { not: null },
      },
      data: {
        hashRt: null,
      },
    });
    // response.cookie('token', '', { httpOnly: true });
    return;
  }
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return createSuccessResponse(INTERNAL_STATUS.OK, INTERNAL_MESSAGE.OK, tokens);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: number, email: string, role: Role): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }
  // change password
  async sendEmailChangePassword(email: string) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user != null && user.isBlocked == true)
      throw new BadRequestException('user isBlock or no find');

    const content = `=
    <a href="http://localhost:3000/api/auth/reset/${user.id}">click here</a> `;
    this.mailService.sendMail({
      to: email,
      from: '"nguyen huu duc  👻" <duccccnguyen@gmail.com>',
      subject: 'change password',
      text: 'welcome',
      html: content,
    });
  }
  async changePassword(userId: number, password: string) {
    // hash
    const hashP = await this.hashData(password);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hash: hashP,
      },
    });
    return {
      message: 'thanh cong ',
    };
  }
}
