import axios from 'axios';
import Provider from "../Provider";

export default class FacebookProvider extends Provider {
  private version = "v3.3";
  private scopes = ["email"];
  private fields = ["id", "email", "name", "picture"];
  
  private buildRedirectUrlFromBase(base: string) {
    const qs = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirect,
      scope: this.scopes.join("%20"),
      response_type: "code"
    });

    return base + "?" + qs.toString();
  }
  
  getRedirectUrl() {
    return this.buildRedirectUrlFromBase(`https://www.facebook.com/${this.version}/dialog/oauth`);
  }
  
  private getTokenResponseUrlParams(code: string) {
    return {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirect
    };
  }
  
  protected async getAccessToken(code: string) {
    const tokenResponse = await axios.get(`https://graph.facebook.com/${this.version}/oauth/access_token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: this.getTokenResponseUrlParams(code)
    });
   return tokenResponse.data.access_token;
  }
  
  protected async getUserInfo(token: string) {
    const { data } = await axios.get(`https://graph.facebook.com/${this.version}/me`, {
      params: {
        fields: this.fields.join(","),
        access_token: token,
      },
    });
    return data;
  }
  
  protected mapToExternalUser(userInfo) {
    return {
      id: userInfo.id,
      name: userInfo.name,
      picture: userInfo.picture.data.url,
      email: userInfo.email,
    }
  }
}

