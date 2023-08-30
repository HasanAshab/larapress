import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import config from "config";
import URL from "URL"
import bcrypt from "bcryptjs";
import hidden from "mongoose-hidden";
import Authenticatable, { AuthenticatableDocument } from "~/app/plugins/Authenticatable";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import HasApiTokens, { HasApiTokensDocument } from "~/app/plugins/HasApiTokens";
import Notifiable, { NotifiableDocument } from "~/app/plugins/Notifiable";
import Attachable, { AttachableDocument } from "~/app/plugins/Attachable";
import Billable, { BillableDocument } from "~/app/plugins/Billable";
import Settings, { ISettings } from "~/app/models/Settings";

const UserSchema = new Schema({
  username: {
    type: String,
    text: true,
    unique: true,
    default: null,
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
    hide: true
  },
  logoUrl: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["novice", "admin"],
    default: "novice",
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  }
}, 
{ 
  timestamps: true,
  methods: {
    safeDetails(this: any) {
      delete this.email;
      delete this.phoneNumber;
      return this;
    }
  }
}
);



UserSchema.pre("save", async function(next) {
  const bcryptRounds = config.get<any>("bcrypt.rounds") ?? 10;
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash as string;
  next();
});

UserSchema.virtual("settings")
  .get(function () {
  return Settings.findOne({ userId: this._id });
});


UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Attachable);
UserSchema.plugin(hidden(), { hidden: { _id: false } });
//UserSchema.plugin(Billable);

export interface IUser extends Document, InferSchemaType<typeof UserSchema>, AuthenticatableDocument, AttachableDocument, HasApiTokensDocument, NotifiableDocument, AttachableDocument, BillableDocument {
  safeDetails(): Omit<InferSchemaType<typeof UserSchema>, "email" | "phoneNumber" | "password">;
  settings: Promise<ISettings>;
};
interface UserModel extends Model<IUser>, HasFactoryModel {};
export default model<IUser, UserModel>("User", UserSchema);