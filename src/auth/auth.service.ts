import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthReponseDto } from './dto/auth-reponse.dto';
import { LoginDto } from './dto/login-dto';
import { EmailService } from './email.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  // Login user
  async login(loginDto: LoginDto): Promise<AuthReponseDto> {
    // Check user
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user || !(await user.isPasswordMatch(loginDto.password)))
      throw new BadRequestException('Incorrect email or password');

    // Generate auth tokens
    const tokens = await this.tokenService.getAuthTokens(user.id, user.role);

    // Update refresh token in database
    await this.userService.updateRfToken(user.id, tokens.refresh_token);

    // success
    return { user, tokens };
  }

  // Register user
  async register(createUserDto: CreateUserDto): Promise<AuthReponseDto> {
    // Create user
    const user = await this.userService.createUser(createUserDto);

    // Generate auth tokens
    const tokens = await this.tokenService.getAuthTokens(user.id, user.role);

    // Update refresh token in database
    await this.userService.updateRfToken(user.id, tokens.refresh_token);

    // success
    return { user, tokens };
  }

  // Logout
  async logout(userId: string): Promise<Boolean> {
    // Remove refresh token in database
    await this.userService.removeRfToken(userId);
    return true;
  }

  // Get refresh auth rokens
  async refreshTokens(
    userId: string,
    rfToken: string,
  ): Promise<AuthReponseDto> {
    // check user
    const user = await this.userService.getUserById(userId);
    if (!user.rfToken || !user.isRfTokenMatch(rfToken))
      throw new ForbiddenException('Access Denied');

    // Generate token
    const tokens = await this.tokenService.getAuthTokens(user.id, user.role);

    // Update refresh token in database
    await this.userService.updateRfToken(user.id, tokens.refresh_token);

    // success
    return { user, tokens };
  }

  // Send mail forgot password
  async forgotPassword(email: string) {
    // check user
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new BadRequestException('Email does not exist in the system.');

    // generate reset password token
    const token = await this.tokenService.getResetPasswordToken(
      user.id,
      user.role,
    );

    // send mail
    let info = await this.emailService.sendMailResetPassword(
      user.email,
      token,
      user.name,
    );

    // Success
    return {
      message: `Resend password, please check email ${info.envelope.to[0]}`,
      email: info.envelope.to[0],
    };
  }

  async resetPassword(userId: string, password: string) {
    // check user
    const user = await this.userService.updatePassword(userId, password);
    // Generate auth tokens
    const tokens = await this.tokenService.getAuthTokens(user.id, user.role);

    // Update refresh token in database
    await this.userService.updateRfToken(user.id, tokens.refresh_token);

    // success
    return { user, tokens };
  }
}
