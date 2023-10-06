import _ from "lodash";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest } from "~/core/express";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import AuthService from "~/app/services/AuthService";
import UpdateNotificationSettingsRequest from "~/app/http/v1/requests/UpdateNotificationSettingsRequest";
import SetupTwoFactorAuthRequest from "~/app/http/v1/requests/SetupTwoFactorAuthRequest";
import UpdateAppSettingsRequest from "~/app/http/v1/requests/UpdateAppSettingsRequest";

export default class SettingsController {
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
  async setupTwoFactorAuth(req: SetupTwoFactorAuthRequest, authService: AuthService){
    const { enable, method } = req.body;
    if(!enable) {
      await authService.disableTwoFactorAuth(req.user);
      return "Two Factor Auth disabled!";
    }
    return {
      message: "Two Factor Auth enabled!",
      data: await authService.enableTwoFactorAuth(req.user, method)
    };
  }
  
  @RequestHandler
  async getAppSettings() {
    return config;
  }

  @RequestHandler
  async updateAppSettings(req: UpdateAppSettingsRequest) {
    _.merge(config, req.body);
    Cache.put("config", req.body);
    return "App Settings updated!";
  }
}
