import _ from "lodash";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";
import { deepMerge } from "helpers";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";
import UpdateNotificationSettingsRequest from "~/app/http/v1/requests/UpdateNotificationSettingsRequest";
import SetupTwoFactorAuthRequest from "~/app/http/v1/requests/SetupTwoFactorAuthRequest";
import UpdateAppSettingsRequest from "~/app/http/v1/requests/UpdateAppSettingsRequest";

export default class SettingsController {
  @RequestHandler
  async index(req: AuthenticRequest, res: Response) {
    res.api(await req.user.settings);
  }
  
  @RequestHandler
  async notification(req: UpdateNotificationSettingsRequest, res: Response) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    res.message("Settings saved!");
  }
  
  @RequestHandler
  async setupTwoFactorAuth(req: SetupTwoFactorAuthRequest, res: Response, twoFactorAuthService: TwoFactorAuthService){
    const { enable = true, method } = req.body;
    if(!enable) {
      await twoFactorAuthService.disable(req.user);
      return res.message("Two Factor Auth disabled!");
    }
    if(method !== "app" && !req.user.phoneNumber)
      return res.status(400).api({ phoneNumberRequired: true });
    const result = await twoFactorAuthService.enable(req.user, method);
    res.api({
      message: "Two Factor Auth enabled!",
      data: result
    });
  }
  
  @RequestHandler
  async getAppSettings(res: Response) {
    res.api(config);
  }

  @RequestHandler
  async updateAppSettings(req: UpdateAppSettingsRequest, res: Response) {
    _.merge(config, req.body);
    Cache.driver("redis").put("config", req.body);
    return res.message("App Settings updated!");
  }
}
