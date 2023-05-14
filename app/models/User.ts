import { model, Schema, Document, Model, InferSchemaType } from 'mongoose';
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

const UserSchema = new Schema({
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


UserSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash as string;
  next();
});

export type IUser = InferSchemaType<typeof UserSchema>;


export default model("User", UserSchema);