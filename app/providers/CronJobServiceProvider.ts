import ServiceProvider from "~/core/providers/CronJobServiceProvider";
import PruneDatabase from "~/app/jobs/PruneDatabase";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  private schedule() {
    //this.call(PruneDatabase).cron("0 0 1 * *");
  }
}