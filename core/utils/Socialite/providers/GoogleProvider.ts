import axios from 'axios';
import SocialiteProvider from "../SocialiteProvider";

export default class GoogleProvider extends SocialiteProvider {
  protected scopes = ["openid", "profile", "email"];
  
  private buildRedirectUrlFromBase(base: string) {
    const qs = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirect,
      scope: this.scopes.join(" "),
      response_type: "code"
    });

    return base + "?" + qs.toString();
  }
  
  getRedirectUrl() {
    return this.buildRedirectUrlFromBase("https://accounts.google.com/o/oauth2/auth");
  }
  
  private getTokenResponseUrlParams(code: string) {
    return {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirect,
      grant_type: 'authorization_code'
    };
  }
  
  protected async getAccessToken(code: string) {
    const tokenResponse = await axios.post('https://accounts.google.com/o/oauth2/token', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: this.getTokenResponseUrlParams(code)
    });
    return tokenResponse.data.access_token;
  }
  
  protected async getUserInfo(token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return data;
  }
  
  protected mapToExternalUser(userInfo: Record<string, any>) {
    return {
      id: userInfo.sub,
      name: userInfo.name,
      picture: userInfo.picture,
      email: userInfo.email,
    }
  }
}
