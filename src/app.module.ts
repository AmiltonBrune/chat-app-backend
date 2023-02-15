import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import {
  UserController,
  AuthController,
  RoomController,
} from './endpoints/controllers';
import { UserService, AuthService, MessageService } from './domain/services';
import { User, Message } from './domain/entities';
import { ChatGateway } from './infra/chat.gateway';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forFeature([User, Message]),
    TypegooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.imriwzg.mongodb.net/chatAppMern?retryWrites=true&w=majority`,
    ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JTW_SECRET,
      signOptions: {
        expiresIn: 18000,
      },
    }),
  ],
  controllers: [UserController, AuthController, RoomController],
  providers: [
    UserService,
    AuthService,
    MessageService,
    ChatGateway,
    JwtStrategy,
  ],
})
export class AppModule {}
