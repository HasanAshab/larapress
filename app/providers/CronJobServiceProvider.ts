import ServiceProvider from "~/core/abstract/ServiceProvider";
import nodeCron from "node-cron";
import Artisan from "Artisan";

export default class CronJobServiceProvider extends ServiceProvider {
  private jobSchedule: [string, string | Function][] = [];

  private schedule() {
    /*
    this.call("test:hf name=jd").cron("* * * * * *");
    this.call("test:hf name=hasan").cron("* * * * * *");
    this.call(() => {
      console.log("custom")
    }).cron("* * * * * *");*/
  }
  
  
  boot() {
    if(this.app.runningInWeb()) {
      this.schedule();
      this.registerCronJobs();
    }
  }
  
  private call(command: string | Function) {
    const cron = cronTime => {
      this.jobSchedule.push([cronTime, command]);
    }
    return { cron };
  }

  private registerCronJobs() {
    for(const [cron, command] of this.jobSchedule) {
      if(typeof command === "string") {
        const [commandName, ...args] = command.split(" ");
        const job: any = async () => await Artisan.call(commandName as any, args, false);
        nodeCron.schedule(cron, job);
      }
      else 
        nodeCron.schedule(cron, command);
    }
  }
}