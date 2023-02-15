import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Put,
  ForbiddenException,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './../../domain/services/user.service';
import { CreateUserDto } from 'src/application/dtos/user';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body(ValidationPipe) user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
