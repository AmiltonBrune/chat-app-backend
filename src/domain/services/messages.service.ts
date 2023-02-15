import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateMessageDto } from 'src/application/dtos';

import { Message } from '../entities';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}

  async create(message: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(message);
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find();
  }

  async getLastMessagesFromRoom(room: string) {
    const roomMessages = await this.messageModel.aggregate([
      { $match: { to: room } },
      { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
    ]);

    return roomMessages;
  }
}
