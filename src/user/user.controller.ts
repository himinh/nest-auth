import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards/at.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create new user
  @UseGuards(RoleGuard(Role.Admin))
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  findAll() {
    return this.userService.getUsers();
  }

  // Get profile
  @UseGuards(AtGuard)
  @Get('/profile')
  getProfile(@GetCurrentUserId() userId: string) {
    return this.userService.getUserById(userId);
  }

  // Get user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // Update profile
  @UseGuards(AtGuard)
  @Patch('/profile')
  updateProfile(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  // Update user
  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete user
  @UseGuards(RoleGuard(Role.Admin))
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // Reset password
  @UseGuards(AtGuard)
  @Post('reset-password')
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body('password') password: string,
  ) {
    // Reset password by userId and new password
    return this.userService.updatePassword(userId, password);
  }
}
