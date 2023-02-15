import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  from: object;

  @ApiProperty()
  socketid: string;

  @ApiProperty()
  time: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  to: string;
}
