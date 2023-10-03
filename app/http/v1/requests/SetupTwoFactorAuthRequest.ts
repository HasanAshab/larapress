import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import config from "config";
import { ISettings } from "~/app/models/Settings";

export default class SetupTwoFactorAuthRequest extends AuthenticRequest {
  body!: { 
    enable: boolean;
    method?: ISettings["twoFactorAuth"]["method"];
  };
  
  protected rules() {
    return {
      enable: Validator.boolean().default(true),
      method: Validator.string().valid(...config.get("twoFactorAuth.methods"))
    }
  }
}
