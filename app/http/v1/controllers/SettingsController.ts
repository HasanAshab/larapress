import { Request } from "express";
import { env, toCamelCase, toSnakeCase } from "helpers";

export default class SettingsController {
  async index() {
    console.log(process.env)
    const envData = env();
    const camelCaseData: Record<string, string> = {};
    for (const key in envData) {
      const camelCaseKey = toCamelCase(key.toLowerCase());
      camelCaseData[camelCaseKey] = envData[key];
    }
    return camelCaseData;
  }
  
  async update(req: Request) {
    const envData: Record<string, string> = {};
    for(const key in req.validated) {
      const envKey = toSnakeCase(key).toUpperCase();
      envData[envKey] = req.validated[key];
    }
    env(envData);
    return { message: "Settings updated!" }
  }
}

