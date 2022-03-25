import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Create user
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userExists = await this.getUserByEmail(createUserDto.email);
    if (userExists)
      throw new BadRequestException('Email already in the system.');
    createUserDto.password = await this.hashData(createUserDto.password);
    const newUser = await this.userModel.create(createUserDto);
    delete newUser.password;
    return newUser;
  }

  // Find all users
  async getUsers(): Promise<UserDocument[]> {
    const users = await this.userModel.find();
    return users;
  }

  // Find user by id
  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Not found user.');
    return user;
  }

  // Find user by email
  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).select('+password');
    return user;
  }

  // Find user by id and update
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    // Find user by userId
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('Not found user.');

    // check email
    if (updateUserDto.email && (await this.getUserByEmail(updateUserDto.email)))
      throw new BadRequestException('Email already in the system.');

    // save user
    Object.assign(user, updateUserDto);
    await user.save();

    // success
    return user;
  }

  // Find user by id and update password
  async updatePassword(
    userId: string,
    password: string,
  ): Promise<UserDocument> {
    const hashPassword = await this.hashData(password);
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true },
    );
    if (!user) throw new NotFoundException('Not found user.');
    return user;
  }

  // Delete user by id
  async deleteUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('Not found user.');
    return user;
  }

  // Hash data
  private hashData(data: string) {
    return argon2.hash(data);
  }

  // Update refresh token
  async updateRfToken(userId: string, rfToken: string) {
    const hashedRt = await this.hashData(rfToken);
    return this.userModel.findByIdAndUpdate(userId, { rfToken: hashedRt });
  }

  removeRfToken(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { rfToken: '' });
  }
}
