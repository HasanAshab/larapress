import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import Config from "Config";
import { DeepPartial } from "utility-types";

export default class UpdateAppSettingsRequest extends AuthenticRequest {
  body!: Record<string, unknown>;
  
  protected rules(obj = Config.get()) {
    if(obj === null || typeof obj === "undefined")
      return null;

    const fields: Record<string, any> = {};
    const type = typeof obj;
    if(type !== "object")
      //@ts-ignore
      return Validator[type]();
    for(const key of Object.keys(obj)){
      fields[key] = this.rules(obj[key])
    }
    return fields;
  }
}
