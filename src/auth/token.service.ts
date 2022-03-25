import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtPayload } from './types';
import { Role } from 'src/common/enums';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Generate token
  generateToken(payload: JwtPayload, secret: string, tokenLife: string) {
    return this.jwtService.signAsync(payload, { secret, expiresIn: tokenLife });
  }

  // Get auth tokens
  async getAuthTokens(userId: string, role: Role) {
    const payload: JwtPayload = { sub: userId, role };
    const [ac, rt] = await Promise.all([
      this.generateToken(payload, jwtConstants.atSecret, jwtConstants.atLife),
      this.generateToken(payload, jwtConstants.rtSecret, jwtConstants.rtLife),
    ]);

    return { access_token: ac, refresh_token: rt };
  }

  // Generate resetPassword token
  async getResetPasswordToken(userId: string, role: Role) {
    const payload: JwtPayload = { sub: userId, role };
    const resetPassToken = await this.generateToken(
      payload,
      jwtConstants.atSecret,
      jwtConstants.atLife,
    );
    return resetPassToken;
  }

  // Verify token
  verifyToken(token: string, secret: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }

  // Verify refresh token
  async verifyRefreshToken(rfToken: string, rfSecret = jwtConstants.rtSecret) {
    const { id, role } = await this.verifyToken(rfToken, rfSecret);
    return { id, role };
  }
}
