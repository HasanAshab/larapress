import config from "config";
import axios from 'axios';

abstract class Provider {
  constructor(private config: object) {
    this.config = config
  }
}

class GoogleProvider extends Provider {
  redirect(res: Response) {
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${this.config.clientId}&redirect_uri=${this.config.redirect}&scope=openid%20profile%20email&response_type=code`;
    res.redirect(url);
  }
  async user(code: string) {
    const query = new URLSearchParams({
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirect,
      grant_type: 'authorization_code',
    });
    const tokenResponse = await axios.post('https://accounts.google.com/o/oauth2/token', query.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token } = tokenResponse.data;
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    console.log(data)
    return data;
  }
}

export default class Socialite {
  static driver(providerName: string) {
    return new GoogleProvider(config.get("socialite.google"));
  }
}