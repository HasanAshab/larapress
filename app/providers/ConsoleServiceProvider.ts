import ServiceProvider from "~/core/abstract/ServiceProvider";
import { SamerArtisan } from 'samer-artisan';

export default class ConsoleServiceProvider extends ServiceProvider {
  /**
  * Boot console services
  */
  boot() {
    SamerArtisan.cacheDist("storage/cache/artisan.json").loadFrom([
      "app/commands",
      "core/component/commands"
    ]);
  }
}