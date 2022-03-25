import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { LoginDto, AuthReponseDto, EmailDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User login
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthReponseDto> {
    return this.authService.login(loginDto);
  }

  // Register
  @Post('register')
  register(@Body() userDto: CreateUserDto): Promise<AuthReponseDto> {
    return this.authService.login(userDto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refreshToken(
    @GetCurrentUserId() userId,
    @GetCurrentUser('rfToken') rfToken,
  ): Promise<AuthReponseDto> {
    return this.authService.refreshTokens(userId, rfToken);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId) {
    return this.authService.logout(userId);
  }

  // Forgot password
  @Post('forgot-password')
  forgotPassword(@Body() { email }: EmailDto) {
    return this.authService.forgotPassword(email);
  }

  // Forgot password
  @UseGuards(AtGuard)
  @Post('reset-password')
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(userId, password);
  }
}
