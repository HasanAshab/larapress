import { url } from "helpers"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
/*
import Authenticatable from "app/traits/Authenticatable";
import Timestamps from "app/traits/Timestamps";
import HasFactory from "app/traits/HasFactory";
import HasApiTokens from "app/traits/HasApiTokens";
import Notifiable from "app/traits/Notifiable";
import Mediable from "app/traits/Mediable";
*/

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

const UserSchema = new mongoose.Schema({
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
UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);
*/

UserSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash as string;
  next();
});

export default mongoose.model("User", UserSchema);