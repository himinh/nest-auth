import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { AtStrategy, RtStrategy } from './strategies';
import { TokenService } from './token.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AtStrategy, RtStrategy, EmailService],
})
export class AuthModule {}
