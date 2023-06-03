import { JwtService } from '@nestjs/jwt';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStratety extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStratety.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }
  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies.token;
    }
    return null;
  }
  validate(payload: any) {
    //console.log(payload);
    const data = this.jwtService.decode(payload.cookies.token);
    //console.log(data);
    //  console.log(payload.cookies.token);
    return {
      ...payload.cookies.token,
      data,
    };
  }
}
