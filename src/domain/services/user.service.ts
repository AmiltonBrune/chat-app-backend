import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CredentialsDto } from 'src/application/dtos';
import { CreateUserDto } from 'src/application/dtos/user';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.etity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({});
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('invalid email or password');

    return user;
  }
}
