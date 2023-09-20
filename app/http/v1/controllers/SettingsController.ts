import { Request, Response } from "express";
import { deepMerge } from "helpers";
import config from "config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";
import speakeasy from "speakeasy";
import TestS from "~/app/services/TestS";
import { injectable } from "tsyringe";

@injectable()
export default class SettingsController {
  constructor(public service: TestS) {}
  
  async index(req: Request, res: Response) {
    res.api(await req.user.settings);
  }
  
  async notification(req: Request, res: Response) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.body });
    res.message("Settings saved!");
  }
  
  async setupTwoFactorAuth(req: Request, res: Response){
    if(req.body.method !== "app") {
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
      return res.message("Two Factor Auth enabled!");
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    req.body.secret = secret.ascii;
    await Settings.updateOne(
      { userId: req.user._id },
      { twoFactorAuth: req.body }
    );
    const appName = config.get<string>("app.name");
    const otpauthURL = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: appName,
      issuer: appName,
    });
    res.api({
      otpauthURL,
      message: "Two Factor Auth enabled!"
    });
  }
  
  async getAppSettings(req: Request, res: Response) {
    res.api(config);
  }
  
  async updateAppSettings(req: Request, res: Response) {
    this.service.fetch();
    return res.message("Check kor")
    deepMerge(config, req.body);
    Cache.driver("redis").put("config", config);
    return res.message("App Settings updated!");
  }
}
