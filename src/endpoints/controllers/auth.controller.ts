import { Controller, Post, Body, ValidationPipe, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './../../domain/services';
import { CredentialsDto, LogoutDto } from 'src/application/dtos/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body(ValidationPipe) credentialsDto: CredentialsDto) {
    return await this.authService.signIn(credentialsDto);
  }

  @Delete('logout')
  async logout(@Body(ValidationPipe) logoutDto: LogoutDto) {
    return await this.authService.logout(logoutDto);
  }
}
