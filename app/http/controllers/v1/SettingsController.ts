import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest } from "~/core/express";
import Config from "Config";
import Settings from "~/app/models/Settings";
import TwoFactorAuthService from "~/app/services/auth/TwoFactorAuthService";
import UpdateNotificationSettingsRequest from "~/app/http/requests/v1/UpdateNotificationSettingsRequest";
import SetupTwoFactorAuthRequest from "~/app/http/requests/v1/SetupTwoFactorAuthRequest";
import UpdateAppSettingsRequest from "~/app/http/requests/v1/UpdateAppSettingsRequest";

export default class SettingsController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await req.user.settings.lean();
  }
  
  @RequestHandler
  async setupNotificationPreference(req: UpdateNotificationSettingsRequest) {
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
  async updateAppSettings({ body }: UpdateAppSettingsRequest) {
    Config.set(body);
    return "App Settings updated!";
  }
}
