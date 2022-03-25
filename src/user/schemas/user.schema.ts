import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';
import { Role } from 'src/common/enums';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      // delete ret.rfToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 6, select: false })
  password: string;

  @Prop({ type: String, enum: Role })
  role: Role;

  @Prop({ type: String, default: '' })
  rfToken: string;

  isPasswordMatch: Function;
  isRfTokenMatch: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods = {
  isPasswordMatch(password: string) {
    return argon2.verify(this.password, password);
  },
  isRfTokenMatch(rfToken: string) {
    return argon2.verify(this.rfToken, rfToken);
  },
};
