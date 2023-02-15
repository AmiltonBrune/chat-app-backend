import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  newMessages: object;
}
