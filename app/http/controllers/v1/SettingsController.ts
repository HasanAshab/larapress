import Controller from "~/core/abstract/Controller";
import _ from "lodash";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest } from "~/core/express";
import Config from "Config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import TwoFactorAuthService from "~/app/services/auth/TwoFactorAuthService";
import UpdateNotificationSettingsRequest from "~/app/http/requests/v1/UpdateNotificationSettingsRequest";
import SetupTwoFactorAuthRequest from "~/app/http/requests/v1/SetupTwoFactorAuthRequest";
import UpdateAppSettingsRequest from "~/app/http/requests/v1/UpdateAppSettingsRequest";

export default class SettingsController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await req.user.settings;
  }
  
  @RequestHandler
  async notification(req: UpdateNotificationSettingsRequest) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    return "Settings saved!";
  }
  
  @RequestHandler
  async setupTwoFactorAuth(req: SetupTwoFactorAuthRequest, twoFactorAuthService: TwoFactorAuthService){
    const { enable, method } = req.body;
    if(!enable) {
      await twoFactorAuthService.disable(req.user);
      return "Two Factor Auth disabled!";
    }
    return {
      message: "Two Factor Auth enabled!",
      data: await twoFactorAuthService.enable(req.user, method)
    };
  }
  
  @RequestHandler
  async getAppSettings() {
    return Config.get();
  }

  @RequestHandler
  async updateAppSettings(req: UpdateAppSettingsRequest) {
    _.merge(Config, req.body);
    Cache.put("Config", req.body);
    return "App Settings updated!";
  }
}
