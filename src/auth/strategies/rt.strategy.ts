import { ForbiddenException, Injectable, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { JwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.rtSecret,
      passReqToCallback: true,
    });
  }

  validate(@Request() req, payload: JwtPayloadWithRt) {
    const rfToken = req.get('authorization').replace('Bearer', '').trim();
    if (!rfToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      rfToken,
    };
  }
}
