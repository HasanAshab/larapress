import { model, Schema, Model, Document } from "mongoose";
import Config from "Config";

const { channels, types } = Config.get<Config["notification"]>("notification");

const notificationDefaults = channels.reduce((defaults, channel) => {
  defaults[channel] = {
    type: Boolean,
    default: true
  }
  return defaults;
}, {});

const twoFactorAuthMethods = ["sms", "call", "app"];

const SettingsSchema = new Schema({
  userId: {
    required: true,
    ref: "User",
    type: Schema.Types.ObjectId,
    cascade: true,
    unique: true
  },
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false,
    },
    method: {
      type: String,
      enum: twoFactorAuthMethods,
      default: "sms",
    },
    secret: {
      type: String,
      default: null
    }
  },
  notification: types.reduce((typeObj, notificationType) => {
    typeObj[notificationType] = notificationDefaults;
    return typeObj;
  }, {})
});

export interface ISettings {
  userId: Schema.Types.ObjectId;
  notification: {
    [type in typeof types[number]]: {
      [channel in typeof channels[number]]: boolean;
    };
  };
  twoFactorAuth: {
    enabled: boolean;
    method: typeof twoFactorAuthMethods[number];
    secret: string | null;
  }
};

export interface SettingsDocument extends Document, ISettings {};
interface SettingsModel extends Model<ISettings> {};

export default model<SettingsDocument, SettingsModel>("Settings", SettingsSchema);
