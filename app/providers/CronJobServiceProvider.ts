import ServiceProvider from "~/core/abstract/ServiceProvider";
import PruneDatabase from "~/app/jobs/PruneDatabase";

import { schedule as cronSchedule } from "node-cron";


export default class CronJobServiceProvider extends ServiceProvider {
  /**
   * Schedule cron jobs of the application
  */ 
  boot() {
    this.cron("* * 1 * *").schedule(() => {
      PruneDatabase.dispatch();
    });
  }
  
  protected cron(expression: string) {
    const schedule = (job: (() => any | Promise<any>)) => {
      cronSchedule(expression, job);
    }
    
    return { schedule };
  }
}