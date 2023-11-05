import { Response } from "express";
import ExternalUser from "./ExternalUser";

export interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  redirect: string;
}

export default abstract class SocialiteProvider {
  constructor(protected readonly config: ProviderConfig) {
    this.config = config
  }
  
  abstract getRedirectUrl(): string;
  protected abstract getAccessToken(code: string): Promise<string>;
  protected abstract getUserInfo(token: string): Promise<object>;
  protected abstract mapToExternalUser(userInfo: Record<string, any>): ExternalUser;

  redirect(res: Response) {
    res.redirect(this.getRedirectUrl());
  }

  async user(code: string) {
    const accessToken = await this.getAccessToken(code);
    const userInfo = await this.getUserInfo(accessToken);
    return this.mapToExternalUser(userInfo);
  }
}
