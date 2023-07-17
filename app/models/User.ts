import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import URL from "illuminate/utils/URL"
import bcrypt from "bcryptjs";
import Authenticatable, { AuthenticatableDocument } from "app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "app/plugins/Notifiable";
import Attachable, { AttachableDocument } from "app/plugins/Attachable";
import Billable, { BillableDocument } from "app/plugins/Billable";

const UserSchema = new Schema({
  name: {
    required: true,
    type: String,
    text: true
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String,
    hide: true
  },
  logoUrl: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, 
{ timestamps: true }
);

UserSchema.pre("save", async function(next) {
  const bcryptRounds = Number(process.env.BCRYPT_ROUNDS) ?? 10;
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash as string;
  next();
});

UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Attachable);
UserSchema.plugin(Billable);

export interface IUser extends Document, InferSchemaType<typeof UserSchema>, AuthenticatableDocument, AttachableDocument, HasApiTokensDocument, NotifiableDocument, AttachableDocument, BillableDocument {};
interface UserModel extends Model<IUser>, HasFactoryModel {};
export default model<IUser, UserModel>("User", UserSchema);