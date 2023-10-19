import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Artisan from "Artisan";
//import Test from "~/app/commands/Test";

export default class ConsoleServiceProvider extends ServiceProvider {
  async boot() {
    //Artisan.add(Test);
    Artisan.load("app/commands");
    Artisan.load("core/component/commands");
  }
}