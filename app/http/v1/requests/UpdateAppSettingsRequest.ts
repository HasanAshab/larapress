import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import config from "config";
import { Config } from "types";
import { DeepPartial } from "utility-types";

export default class UpdateAppSettingsRequest extends AuthenticRequest {
  body!: DeepPartial<Config>;
  
  protected rules(obj = config) {
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
