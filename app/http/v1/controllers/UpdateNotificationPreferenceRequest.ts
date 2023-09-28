import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import { UploadedFile } from "express-fileupload";
import config from "config";
import { ISettings } from "~/app/models/Settings";

export default class UpdateNotificationPreferenceRequest extends AuthenticRequest {
  body!: ISettings["notification"];
    
  protected rules() {
    const { channels, types } = config.get("notification");
    const channelsSchema: Record<string, unknown> = {}
    const fields: Record<string, unknown> = {};

    for(const channel of channels) {
      channelsSchema[channel] = Validator.boolean();
    }
    for(const notificationType of types){
      fields[notificationType] = channelsSchema;
    }
    return fields;
  }
}
