import ServiceProvider from "./ServiceProvider";
import { schedule as cronSchedule } from "node-cron";


export default class CronJobServiceProvider extends ServiceProvider {
  protected cron(expression: string) {
    const schedule = (job: (() => any | Promise<any>)) => {
      cronSchedule(expression, job);
    }
    
    return { schedule };
  }
}