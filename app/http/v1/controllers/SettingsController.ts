import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import { deepMerge } from "helpers";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";

@controller
export default class SettingsController {
  async index(req: Request, res: Response) {
    res.api(await req.user.settings);
  }
  
  async notification(req: Request, res: Response) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    res.message("Settings saved!");
  }
  
  async setupTwoFactorAuth(req: Request, res: Response){
    if (!req.user.phoneNumber){
      return res.status(400).api({
        phoneNumberRequired: true,
        message: "Please set phone number before trying to enable Two Factor Auth!"
      });
    }
    await Settings.updateOne(
      { userId: req.user._id },
      { twoFactorAuth: req.body }
    );
    res.message("Settings saved!");
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
