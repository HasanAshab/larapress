import { Request, Response } from "express";
import Controller from "~/core/decorators/controller";
import { inject } from "~/core/decorators/meta-data";
import { deepMerge } from "helpers";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";

@Controller
export default class SettingsController {
  async index(req: Request, res: Response) {
    res.api(await req.user.settings);
  }
  
  async notification(req: Request, res: Response) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    res.message("Settings saved!");
  }

  async setupTwoFactorAuth(req: Request, res: Response, @inject twoFactorAuthService: TwoFactorAuthService){
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
  
  async getAppSettings(req: Request, res: Response) {
    res.api(config);
  }

  async updateAppSettings(req: Request, res: Response) {
    deepMerge(config, req.body);
    Cache.driver("redis").put("config", config);
    return res.message("App Settings updated!");
  }
}
