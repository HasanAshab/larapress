import ServiceProvider from "~/core/providers/ServiceProvider";
import { SamerArtisan } from 'samer-artisan';

export default class ConsoleServiceProvider extends ServiceProvider {
  /**
  * Boot console services
  */
  boot() {
    SamerArtisan.load([
      "app/commands",
      "core/component/commands"
    ]);
  }
}