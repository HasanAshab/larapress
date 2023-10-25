import config from "config";
import GoogleProvider from "./providers/GoogleProvider";
import FacebookProvider from "./providers/FacebookProvider";

export default class Socialite {
  static $providers =  {
    "google": new GoogleProvider(config.get("socialite.google")),
    "facebook": new FacebookProvider(config.get("socialite.facebook")),
  };
  
  static driver(providerName: keyof typeof Socialite.$providers) {
   return this.$providers[providerName];
  }
}