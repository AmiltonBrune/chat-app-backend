import { prop, pre } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

@pre<User>('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
})
export class User {
  @prop({
    required: [true, 'Please enter a name'],
  })
  name: string;

  @prop({
    lowercase: true,
    required: [true, 'Please enter an email'],
    unique: true,
    index: true,
    validate: {
      validator: (email: string) => {
        const emailRegExp =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegExp.test(email);
      },
    },
  })
  email: string;

  @prop({
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  })
  password: string;
  @prop()
  picture: string;

  @prop({
    default: {},
  })
  newMessages: object;

  @prop({
    default: 'online',
  })
  status: string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
