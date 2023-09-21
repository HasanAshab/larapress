import { Request, Response } from "express";
import { deepMerge } from "helpers";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import TwoFactorAuthService from "~/app/services/TwoFactorAuthService";
import TestS from "~/app/services/TestS";
import { injectable } from "tsyringe";

@injectable()
export default class SettingsController {
  constructor(public service: TestS, public twoFactorAuthService: TwoFactorAuthService) {}
  
  async index(req: Request, res: Response) {
    res.api(await req.user.settings);
  }
  
  async notification(req: Request, res: Response) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    res.message("Settings saved!");
  }
  
  async setupTwoFactorAuth(req: Request, res: Response){
    const { enable = true, method } = req.body;
    if(!enable) {
      await this.twoFactorAuthService.disable(req.user);
      return res.message("Two Factor Auth disabled!");
    }
    const result = await this.twoFactorAuthService.enable(req.user, method);
    if(method === "app") {
      return res.api({
        otpauthURL: result,
        message: "Two Factor Auth enabled!"
      });
    }
    if(result)
      return res.message("Two Factor Auth enabled!");
    res.status(400).api({
      phoneNumberRequired: true,
      message: "Please set phone number before trying to enable Two Factor Auth!"
    });
  }
  
  async getAppSettings(req: Request, res: Response) {
    console.log(this.service);
    res.api(config);
  }
  
  async updateAppSettings(req: Request, res: Response) {
    deepMerge(config, req.body);
    Cache.driver("redis").put("config", config);
    return res.message("App Settings updated!");
  }
}
