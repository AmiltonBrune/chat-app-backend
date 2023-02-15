import { prop } from '@typegoose/typegoose';

export class Message {
  @prop()
  content: string;

  @prop()
  from: object;

  @prop()
  socketid: string;

  @prop()
  time: string;

  @prop()
  date: string;

  @prop()
  to: string;
}
