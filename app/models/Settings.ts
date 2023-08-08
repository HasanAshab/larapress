import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import notificationConfig from "register/notification";

const schemaData = {
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
    unique: true
  },
  twoFactorAuth: {
      enabled: {
        type: Boolean,
        default: false
      },
      method: {
        type: String,
        enum: ["sms", "call"],
        default: "sms"
      }
  },
  notification: {}
}

const value = {};
for(const channel of notificationConfig.channels){
  value[channel] = {
    type: Boolean,
    default: true
  };
}
for(const notificationType of notificationConfig.types){
  schemaData.notification[notificationType] = value;
}

const SettingsSchema = new Schema(schemaData);

SettingsSchema.plugin(HasFactory);

export interface ISettings extends Document {
  userId: Schema.Types.ObjectId;
  notification: {
    enabled: boolean;
    channels: {
      email: boolean;
      push: boolean;
    }
  },
  twoFactorAuth: {
    enabled: boolean;
    method: "sms" | "call";
  }
};
interface SettingsModel extends Model<ISettings>, HasFactoryModel {};
export default model<ISettings, SettingsModel>("Settings", SettingsSchema);