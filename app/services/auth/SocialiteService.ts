import { OAuth2Client } from 'google-auth-library';
import { singleton } from "tsyringe";

//resolve OAuth2Client with clientId, clientSecret
//client -> this.oauth2Client

@singleton()
export default class SocialiteService {
  constructor(oauth2Client: OAuth2Client) {}
  
  async loginGoogle(code: string) {
    const { clientId, clientSecret, redirectUrl } = config.get<any>("socialite.google");

    const { tokens } = await client.getToken({ 
      code,
      redirect_uri: redirectUrl 
    })!;
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: clientId,
    });
    const { email, picture } = ticket.getPayload()!;
    const user = await User.findOneAndUpdate(
      { email },
      { "logo.url": picture, verified: true },
      { upsert: true, new: true }
    );
    const frontendClientUrl = user.username
      ? URL.client("oauth/success?token=" + user.createToken())
      : URL.client("oauth/set-username?token=" + user.createToken());
 
  }
}