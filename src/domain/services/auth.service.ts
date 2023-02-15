import { LogoutDto } from './../../application/dtos/auth/logout.dto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from './user.service';
import { CredentialsDto } from 'src/application/dtos';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../entities';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(credentialsDto: CredentialsDto) {
    const user: any = await this.userService.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.status = 'online';
    await user.save();

    const jwtPayload = {
      id: user._id,
    };
    const token = this.jwtService.sign(jwtPayload);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      status: user.status,
      token,
    };
  }

  async logout(logoutDto: LogoutDto) {
    const { _id, newMessages } = logoutDto;

    const user = await this.userModel.findById(_id);
    user.status = 'offline';
    user.newMessages = newMessages;

    await user.save();

    const members = await this.userService.findAll();

    return members;
  }
}
