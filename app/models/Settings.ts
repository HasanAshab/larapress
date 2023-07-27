import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";

const SettingsSchema = new Schema(
{
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
//    unique: true
  },
  notification: {
    enabled: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: true,
    },
  },
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false,
    },
    method: {
      type: String,
      enum: ["sms", "call"],
      default: "sms"
    }
  }
},
{ timestamps: true }
);

SettingsSchema.plugin(HasFactory);


export interface ISettings extends Document, InferSchemaType<typeof SettingsSchema> {};
interface SettingsModel extends Model<ISettings>, HasFactoryModel {};
export default model<ISettings, SettingsModel>("Settings", SettingsSchema);