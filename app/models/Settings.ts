import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "~/app/plugins/HasFactory";
import notificationConfig from "~/register/notification";
import otpConfig from "~/register/otp"

const schemaData: any = {
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
      enum: otpConfig.methods,
      default: "sms"
    }
  },
  notification: {}
}

const value: any = {};
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
    [type in typeof notificationConfig.types[number]]: {
      [channel in typeof notificationConfig.channels[number]]: boolean;
    };
  };
  twoFactorAuth: {
    enabled: boolean;
    method: typeof otpConfig["methods"][number];
  }
};
interface SettingsModel extends Model<ISettings>, HasFactoryModel {};
export default model<ISettings, SettingsModel>("Settings", SettingsSchema);