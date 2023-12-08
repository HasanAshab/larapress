import ServiceProvider from "~/core/providers/CronJobServiceProvider";
import PruneDatabase from "~/app/jobs/PruneDatabase";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  boot() {
    this.cron("* * 1 * *").schedule(() => {
      PruneDatabase.dispatch();
    });
  }
}