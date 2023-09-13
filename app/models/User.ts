import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import hidden from "mongoose-hidden";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Attachable, { AttachableDocument } from "~/app/plugins/Attachable";
//import Billable, { BillableDocument } from "~/app/plugins/Billable";
import Settings, { ISettings } from "~/app/models/Settings";
import Cascade from "~/app/plugins/Cascade";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
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
  logoUrl: String,
}, 
{ timestamps: true }
);

UserSchema.virtual('settings', {
  ref: 'Settings',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

UserSchema.methods.safeDetails = function(this: any) {
  delete this.email;
  delete this.phoneNumber;
  return this;
}


UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Attachable);
UserSchema.plugin(hidden(), { hidden: { _id: false } });
//UserSchema.plugin(Billable);
UserSchema.plugin(Cascade, [
  {
    ref: "Notification",
    foreignField: "userId"
  },
  {
    ref: "Attachment",
    foreignField: "attachableId"
  }, 
  {
    ref: "Settings",
    foreignField: "userId",
  },
]);

export interface IUser extends Document, InferSchemaType<typeof UserSchema>, AuthenticatableDocument, AttachableDocument, HasApiTokensDocument, NotifiableDocument, AttachableDocument, BillableDocument {
  safeDetails(): Omit<InferSchemaType<typeof UserSchema>, "email" | "phoneNumber" | "password">;
  settings: Promise<ISettings>;
};
interface UserModel extends Model<IUser>, HasFactoryModel {};
export default model<IUser, UserModel>("User", UserSchema);