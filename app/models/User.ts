import mongoose, { Schema, Document, Model } from 'mongoose';
import { url } from "helpers"
import bcrypt from "bcryptjs";
import Mailable from "illuminate/mails/Mailable";

/*
import Authenticatable from "app/traits/Authenticatable";
import Timestamps from "app/traits/Timestamps";
import HasFactory from "app/traits/HasFactory";
import HasApiTokens from "app/traits/HasApiTokens";

import Mediable from "app/traits/Mediable";
*/
import Notifiable from "app/traits/Notifiable";

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  logoUrl: string;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    maxlength: 12,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    default: url('/static/user-profile.jpg'),
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
});

/*
UserSchema.plugin(Authenticatable);
UserSchema.plugin(Timestamps);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);

UserSchema.plugin(Mediable);
*/
UserSchema.plugin(Notifiable);


UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash as string;
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;