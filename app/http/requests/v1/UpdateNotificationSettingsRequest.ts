import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import Config from "Config";
import { ISettings } from "~/app/models/Settings";
import { DeepPartial } from "utility-types";

export default class UpdateNotificationSettingsRequest extends AuthenticRequest {
  body!: ISettings["notification"];

  static rules() {
    const { channels, types } = Config.get("notification");
    const channelsSchema: Record<string, unknown> = {}
    const fields: Record<string, unknown> = {};
    for(const channel of channels){
      channelsSchema[channel] = Validator.boolean();
    }
    for(const notificationType of types){
      fields[notificationType] = channelsSchema;
    }
    return fields;
  }
}
