import { Request } from "express";
import { env, toCamelCase, toSnakeCase } from "helpers";
import Settings from "app/models/Settings";

export default class SettingsController {
  async index(req: Request) {
    return await req.user.settings;
  }
  
  async notification(req: Request) {
    console.log(req.validated)
    const { modifiedCount } = await Settings.updateOne({ userId: req.user._id }, { notification: req.validated });
    return modifiedCount === 1
      ? { message: "Settings saved!" }
      : { status: 500, message: "Faild to update settings!" };
  }
  
  async enableTwoFactorAuth(req: Request){
    const { otp, method } = req.validated;
    const isValidOtp = await req.user.verifyOtp(parseInt(otp));
    if (!isValidOtp){
      return {
        status: 401,
        message: "Invalid OTP. Please try again!",
      };
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
    return { message: `Two Factor Auth enabled!`};
  }
  
  async getAppSettings() {
    const envData = env();
    const camelCaseData: Record<string, string> = {};
    for (const key in envData) {
      const camelCaseKey = toCamelCase(key.toLowerCase());
      camelCaseData[camelCaseKey] = envData[key];
    }
    return camelCaseData;
  }
  
  async updateAppSettings(req: Request) {
    const envData: Record<string, string> = {};
    for(const key in req.validated) {
      const envKey = toSnakeCase(key).toUpperCase();
      envData[envKey] = req.validated[key];
    }
    env(envData);
    return { message: "Settings updated!" }
  }
}

