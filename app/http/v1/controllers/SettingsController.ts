import { Request } from "express";
import { env, toCamelCase, toSnakeCase } from "helpers";
import Settings from "app/models/Settings";

export default class SettingsController {
  async index(req: Request) {
    return await req.user.settings;
  }
  
  async enableTwoFactorAuth(req: Request){
    const { phoneNumber, method } = req.validated;
    if(!req.user.phoneNumber){
      if(!phoneNumber){
        return {
          status: 400,
          message: "Phone number is required!"
        }
      }
      req.user.phoneNumber = phoneNumber;
      await req.user.save();
    }
    const settings = await Settings.create({
      twoFactorAuth: {
        enable: true,
        method
      }
    });
    await req.user.sendOtp();
    return { message: `OTP sent to ${req.user.phoneNumber}!`};
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

