import { model, Schema, Model, Document } from "mongoose";
import hidden from "mongoose-hidden";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Attachable, { FileMeta, AttachableDocument } from "~/app/plugins/Attachable";
//import Billable, { BillableDocument } from "~/app/plugins/Billable";
import Settings, { ISettings } from "~/app/models/Settings";
import Cascade from "~/app/plugins/Cascade";

const UserSchema = new Schema({
 // name
  username: {
    type: String,
    unique: true
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  phoneNumber: String,
  password: {
    type: String,
    hide: true
  },
  role: {
    type: String,
    enum: ["admin", "novice"],
    default: "novice"
  },
  verified: {
    type: Boolean,
    default: false,
  },
  recoveryCodes: [String],
  externalId: Object
}, 
{ timestamps: true }
);


UserSchema.virtual("settings").get(function() {
  return Settings.findOne({ userId: this._id });
});

UserSchema.methods.safeDetails = function(this: any) {
  delete this.email;
  delete this.phoneNumber;
  return this;
}

UserSchema.statics.generateUniqueUsername = async function(name: string) {
  name = name.substring(0, 12);
  const regex = new RegExp(`^${name}\\d.`);
  const prefixMatchedUsers = await this.find({ username: { $regex: regex } });
  console.log(prefixMatchedUsers);
  return name;
}

UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Attachable, { logo: {} });
UserSchema.plugin(hidden(), { hidden: { _id: false } });
//UserSchema.plugin(Billable);
UserSchema.plugin(Cascade, [
  {
    ref: "Notification",
    foreignField: "userId"
  },
  {
    ref: "Settings",
    foreignField: "userId",
  },
]);

export interface IUser {
  username: string | null;
  email: string;
  phoneNumber: string | null;
  password: string | null;
  role: "admin" | "novice";
  verified: boolean;
  logo: FileMeta | null;
  recoveryCodes: string[];
}

export interface UserDocument extends Document, IUser, AuthenticatableDocument, AttachableDocument, HasApiTokensDocument, NotifiableDocument, AttachableDocument {
  settings: Promise<ISettings>;
  safeDetails(): Omit<InferSchemaType<typeof UserSchema>, "email" | "phoneNumber">;
};

interface UserModel extends Model<UserDocument>, HasFactoryModel {};

export default model<IUser, UserModel>("User", UserSchema);