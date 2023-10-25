import Config from "Config";
import GoogleProvider from "./providers/GoogleProvider";
import FacebookProvider from "./providers/FacebookProvider";

export default class Socialite {
  static $providers =  {
    "google": new GoogleProvider(Config.get("socialite.google")),
    "facebook": new FacebookProvider(Config.get("socialite.facebook")),
  };
  
  static driver(providerName: keyof typeof Socialite.$providers) {
   return this.$providers[providerName];
  }
}