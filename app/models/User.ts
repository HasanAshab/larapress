import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import URL from "illuminate/utils/URL"
import bcrypt from "bcryptjs";
import Authenticatable, {
  IAuthenticatable
} from "app/plugins/Authenticatable";
import HasFactory, {
  IHasFactory
} from "app/plugins/HasFactory";
import HasApiTokens, {
  IHasApiTokens
} from "app/plugins/HasApiTokens";
import Notifiable, {
  INotifiable
} from "app/plugins/Notifiable";
import Attachable, { IAttachable } from "app/plugins/Attachable";
import Billable, { IBillable } from "app/plugins/Billable";

const UserSchema = new Schema({
  name: {
    type: String,
    maxlength: 12,
    required: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  logoUrl: {
    type: String,
    default: URL.resolve("/static/user-profile.jpg"),
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

type IPlugin = {statics: {}, instance: {}} & IAuthenticatable & IHasFactory & IHasApiTokens & INotifiable & IAttachable & IBillable;
export type IUser = Document & InferSchemaType<typeof UserSchema> & IPlugin["instance"];
type UserModel = Model<IUser> & IPlugin["statics"];
  
export default model<IUser, UserModel>("User", UserSchema);