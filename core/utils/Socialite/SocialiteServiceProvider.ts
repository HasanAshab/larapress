import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import SocialiteManager from "./SocialiteManager";

export default class SocialiteServiceProvider extends ServiceProvider {
  register() {
    container.register("Socialite", { useValue: new SocialiteManager() });
  }
}