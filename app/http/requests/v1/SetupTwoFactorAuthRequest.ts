import { AuthenticRequest } from "~/core/express";
import Validator from "Validator";
import Config from "Config";
import { ISettings } from "~/app/models/Settings";

export default class SetupTwoFactorAuthRequest extends AuthenticRequest {
  body!: { 
    enable: boolean;
    method?: ISettings["twoFactorAuth"]["method"];
  };
  
  static rules() {
    return {
      enable: Validator.boolean().default(true),
      method: Validator.string().valid(...Config.get("auth.twoFactorAuth.methods"))
    }
  }
}
