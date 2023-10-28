export default abstract class SocialiteProvider {
  constructor(private config: object) {
    this.config = config
  }
  
  abstract getRedirectUrl(): string;
  abstract getAccessToken(code: string): Promise<string>;
  abstract getUserInfo(token: string): Promise<object>;
  abstract mapToExternalUser(userInfo: object): ExternalUser;

  redirect(res: Response) {
    res.redirect(this.getRedirectUrl());
  }

  async user(code: string) {
    const accessToken = await this.getAccessToken(code);
    const userInfo = await this.getUserInfo(accessToken);
    return this.mapToExternalUser(userInfo);
  }
}
