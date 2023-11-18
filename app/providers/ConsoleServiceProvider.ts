import ServiceProvider from "~/core/abstract/ServiceProvider";
import { SamerArtisan } from 'samer-artisan';

export default class ConsoleServiceProvider extends ServiceProvider {
  /**
  * Boot console services
  */
  boot() {
    SamerArtisan.load([
      "dist/app/commands",
      "dist/core/component/commands"
    ]);
  }
}