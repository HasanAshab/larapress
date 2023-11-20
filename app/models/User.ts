import { model, Schema, Document, Model } from "mongoose";
import hidden from "mongoose-hidden";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Mediable, { MediableDocument } from "~/app/plugins/Mediable";
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
  profile: Schema.Types.ObjectId,
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

UserSchema.method("createDefaultSettings", function() {
  return Settings.create({ userId: this._id });
});


UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);
UserSchema.plugin(hidden(), { hidden: { _id: false } });
//UserSchema.plugin(Billable);

export interface IUser {
  name: string;
  username: string;
  email: string;
  profile: Schema.Types.ObjectId | null;
  phoneNumber: string | null;
  password: string | null;
  role: "admin" | "novice";
  verified: boolean;
  recoveryCodes: string[];
  externalId: Record<string, string>;
}

export interface UserDocument extends Document, IUser, AuthenticatableDocument, MediableDocument, HasApiTokensDocument, NotifiableDocument<UserDocument> {
  settings: Promise<SettingsDocument>;
  createDefaultSettings(): Promise<SettingsDocument>;
};

interface UserModel extends Model<UserDocument>, HasFactoryModel {};

export default model<UserDocument, UserModel>("User", UserSchema);