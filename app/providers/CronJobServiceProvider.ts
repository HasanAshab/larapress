import ServiceProvider from "~/core/providers/CronJobServiceProvider";
import nodeCron from "node-cron";
import Artisan from "Artisan";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  private schedule() {
    /*
    this.call("test:hf name=jd").cron("* * * * * *");
    this.call("test:hf name=hasan").cron("* * * * * *");
    this.call(() => {
      console.log("custom")
    }).cron("* * * * * *");*/
  }
}