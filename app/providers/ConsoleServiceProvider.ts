import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Artisan from "Artisan";

export default class ConsoleServiceProvider extends ServiceProvider {
  /**
  * Boot console services
  */
  boot() {
    Artisan.load("app/commands");
    Artisan.load("core/component/commands");
  }
}