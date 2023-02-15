import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './../../domain/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JTW_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    const { id } = payload;
    const userDB = await this.userService.findOne(id);

    if (!userDB) {
      throw new UnauthorizedException('User not found');
    }

    const user = { ...userDB };

    return user;
  }
}
