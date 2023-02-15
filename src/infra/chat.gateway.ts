import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { UserService, MessageService } from 'src/domain/services';
import { sortRoomMessageByDate } from 'src/core/utils/utils';

@WebSocketGateway({
  serveClient: false,
  cors: {
    origin: `*`,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(server);
  }

  handleConnection(socket: any) {
    console.log(`Connected: `, socket.handshake.query);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: `, client.handshake.query);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: Socket, payload: any) {
    const newRoom = Array.isArray(payload) ? payload[0] : payload;
    const previousRoom = Array.isArray(payload) ? payload[1] : null;

    client.join(newRoom);
    client.leave(previousRoom);

    let roomMessages = await this.messageService.getLastMessagesFromRoom(
      newRoom,
    );

    roomMessages = sortRoomMessageByDate(roomMessages);

    client.emit('room-messages', roomMessages);
  }

  @SubscribeMessage('new-user')
  async newUser(client: Socket) {
    const members = await this.userService.findAll();

    this.server.emit('new-user', members);
  }

  @SubscribeMessage('logout')
  async logout(client: Socket) {
    const members = await this.userService.findAll();
    client.broadcast.emit('new-user', members);
  }

  @SubscribeMessage('message-room')
  async handleMessageRoom(client: Socket, payload: any) {
    const [room, content, sender, time, date] = payload;

    await this.messageService.create({
      content,
      from: sender,
      time,
      date,
      to: room,
      socketid: client.id,
    });

    let roomMessages = await this.messageService.getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessageByDate(roomMessages);

    this.server.to(room).emit('room-messages', roomMessages);

    client.broadcast.emit('notifications', room);
  }
}
