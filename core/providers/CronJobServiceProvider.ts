import ServiceProvider from "~/core/abstract/ServiceProvider";
import CallConsoleCommand from "~/app/jobs/CallConsoleCommand";

export default abstract class CronJobServiceProvider extends ServiceProvider {
  private jobSchedule: [string, Function][] = [];

  abstract private schedule(): void;
  
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
      CallConsoleCommand.repeat(cron).dispatch(command);
    }
  }
}