import ServiceProvider from "~/core/providers/CronJobServiceProvider";
import Artisan from "Artisan";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  private schedule() {
    //this.call("db:prune").cron("0 0 1 * *");
  }
}