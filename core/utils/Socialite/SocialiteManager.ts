import Manager from "~/core/abstract/Manager";
import Config from "Config";
import GoogleProvider from "./providers/GoogleProvider";
import FacebookProvider from "./providers/FacebookProvider";

export default class SocialiteManager extends Manager {
  protected createGoogleDriver() {
    return new GoogleProvider(Config.get("socialite.google"));
  }
  
  protected createFacebookDriver() {
    return new FacebookProvider(Config.get("socialite.facebook"));
  }
}
