import { model, Schema, Document, Model } from "mongoose";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasPolicy, { HasPolicyDocument } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Mediable, { MediableDocument } from "~/app/plugins/Mediable";
//import Billable, { BillableDocument } from "~/app/plugins/Billable";
import Settings, { SettingsDocument } from "~/app/models/Settings";
import UserPolicy from "~/app/policies/UserPolicy";

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
  profile: String,
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
  recoveryCodes: {
    type: [String],
    hide: true
  },
  externalId: {
    type: Object,
    index: true,
    hide: true
  }
}, 
{ timestamps: true }
);


UserSchema.virtual("settings").get(function() {
  return Settings.findOne({ userId: this._id });
});


UserSchema.method("createDefaultSettings", function() {
  return Settings.create({ userId: this._id });
});


UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasPolicy, UserPolicy);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);
//UserSchema.plugin(Billable);

export interface IUser {
  name: string;
  username: string;
  email: string;
  profile: string | null;
  phoneNumber: string | null;
  password: string | null;
  role: "admin" | "novice";
  verified: boolean;
  recoveryCodes: string[];
  externalId: Record<string, string>;
}

export interface UserDocument extends Document, IUser, AuthenticatableDocument, HasPolicyDocument<UserPolicy>, MediableDocument, HasApiTokensDocument, NotifiableDocument<UserDocument> {
  settings: Query<SettingsDocument, SettingsDocument>;
  createDefaultSettings(): Promise<SettingsDocument>;
};

interface UserModel extends Model<UserDocument>, HasFactoryModel {};

export default model<UserDocument, UserModel>("User", UserSchema);