import config from "config";
import axios from 'axios';

interface ExternalUser {
  id: string;
  name: string;
  picture: string;
  email?: string;
}

abstract class Provider {
  constructor(private config: object) {
    this.config = config
  }
  
  abstract getRedirectUrl(): string;
  abstract user(code: string): ExternalUser;
  
  redirect(res: Response) {
    res.redirect(this.getRedirectUrl());
  }

}

class GoogleProvider extends Provider {
  getRedirectUrl() {
    return `https://accounts.google.com/o/oauth2/auth?client_id=${this.config.clientId}&redirect_uri=${this.config.redirect}&scope=openid%20profile%20email&response_type=code`;
  }
  async user(code: string) {
    const tokenResponse = await axios.post('https://accounts.google.com/o/oauth2/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirect,
        grant_type: 'authorization_code',
      }

    });
    const { access_token } = tokenResponse.data;
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    return {
      id: data.sub,
      name: data.name,
      picture: data.picture,
      email: data.email,
    }
  }
}

class FacebookProvider extends Provider {
  getRedirectUrl() {
    return `https://www.facebook.com/v3.3/dialog/oauth?client_id=${this.config.clientId}&redirect_uri=${this.config.redirect}&response_type=code&scope=email`;
  }
  
  async user(code: string) {
    const tokenResponse = await axios.get('https://graph.facebook.com/v3.3/oauth/access_token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirect,
      }
    });

    const { access_token } = tokenResponse.data;

    const { data } = await axios.get('https://graph.facebook.com/v3.3/me', {
      params: {
        fields: "id,email,name,picture",
        access_token,
      },
    });
    return {
      id: data.id,
      name: data.name,
      picture: data.picture.data.url,
      email: data.email,
    }
  }
}

const providers = {
  "google": new GoogleProvider(config.get("socialite.google")),
  "facebook": new FacebookProvider(config.get("socialite.facebook")),
}
export default class Socialite {
  static driver(providerName: string) {
   return providers[providerName]
  }
}