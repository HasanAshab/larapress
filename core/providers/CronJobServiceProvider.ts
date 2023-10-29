import ServiceProvider from "~/core/abstract/ServiceProvider";
import Job from "~/core/abstract/Job";
import nodeCron from "node-cron";

export default abstract class CronJobServiceProvider extends ServiceProvider {
  private jobSchedule: [string, Job][] = [];

  abstract private schedule(): void;
  
  boot() {
    if(this.app.runningInWeb()) {
      this.schedule();
      this.registerCronJobs();
    }
  }
  
  private call(JobClass: Job) {
    const cron = cronTime => this.jobSchedule.push([cronTime, JobClass]);
    return { cron };
  }


  private registerCronJobs() {
    for(const [cron, Job] of this.jobSchedule) {
      nodeCron.schedule(cron, () => Job.dispatch());
    }
  }
}