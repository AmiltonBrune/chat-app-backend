import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('rooms')
@ApiTags('rooms')
export class RoomController {
  @Get()
  async getAll() {
    const rooms = ['General', 'Technology', 'Crypto', 'Faq'];
    return rooms;
  }
}
