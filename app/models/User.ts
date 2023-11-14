import { model, Schema, Document, Model } from "mongoose";
import hidden from "mongoose-hidden";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Attachable, { AttachableDocument } from "~/app/plugins/Attachable";
//import Billable, { BillableDocument } from "~/app/plugins/Billable";
import Settings, { SettingsDocument } from "~/app/models/Settings";

const UserSchema = new Schema<UserDocument>({
  name: String,
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
  externalId: {
    type: Object,
    index: true
  }
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

UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Attachable);
UserSchema.plugin(hidden(), { hidden: { _id: false } });
//UserSchema.plugin(Billable);

export interface IUser {
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  password: string | null;
  role: "admin" | "novice";
  verified: boolean;
  recoveryCodes: string[];
  externalId: Record<string, string>;
}

export interface UserDocument extends Document, IUser, AuthenticatableDocument, AttachableDocument, HasApiTokensDocument, NotifiableDocument<UserDocument> {
  settings: Promise<SettingsDocument>;
  safeDetails(): Omit<UserDocument, "email" | "phoneNumber">;
};

interface UserModel extends Model<UserDocument>, HasFactoryModel {};

export default model<UserDocument, UserModel>("User", UserSchema);