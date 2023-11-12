import ServiceProvider from "~/core/abstract/ServiceProvider";
import PruneDatabase from "~/app/jobs/PruneDatabase";

export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  boot() {
    PruneDatabase.repeat("* * * * * *").dispatch({});
  }
}