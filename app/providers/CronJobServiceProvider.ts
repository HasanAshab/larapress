import ServiceProvider from "~/core/providers/CronJobServiceProvider";
import nodeCron from "node-cron";
import Artisan from "Artisan";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  private schedule() {
    this.call("test iejd").cron("* * * * * *");
    //this.call("db:prune").cron("0 0 1 * *");
  }
}