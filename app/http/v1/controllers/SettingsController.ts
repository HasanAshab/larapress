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
  
  async enableTwoFactorAuth(req: Request, res: Response){
    const { otp, method } = req.body;
    const isValidOtp = await req.user.verifyOtp(parseInt(otp));
    if (!isValidOtp){
      return res.status(401).message("Invalid OTP. Please try again!");
    }
    await Settings.updateOne(
    { userId: req.user._id },
    {
      twoFactorAuth: {
        enabled: true,
        method
      }
    }
    );
    res.message("Two Factor Auth enabled!");
  }
  
  async getAppSettings() {
    res.api(config);
  }
  
  async updateAppSettings(req: Request, res: Response) {
    deepMerge(config, req.body);
    Cache.driver("redis").put("config", config);
    return res.message("Settings updated!");
  }
}
