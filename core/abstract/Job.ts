import Queue from "Queue";
import { JobOptions as BullJobOptions } from "bull";

export interface JobOptions {
  shouldQueue: boolean,
  dispatchAfter: number,
  cron: string | null
}

abstract class Job<JobData = object> {
  static $options: JobOptions = {
    shouldQueue: true,
    dispatchAfter: 0,
    cron: null
  }

  public channel = "default";
  public concurrency = 1;
  public tries = 1;
  public timeout = 10000;
  
  public abstract handle(data: JobData): Promise<void>;
  
  static delay(ms: number) {
    this.$options.dispatchAfter = ms;
    return this;
  }
  
  static withoutQueue() {
    this.$options.shouldQueue = false;
    return this;
  }
  
  static repeat(cron: string) {
    this.$options.cron = cron;
    return this;
  }

  static resetOptions() {
    this.$options = {
      shouldQueue: true,
      dispatchAfter: 0,
      cron: null
    }
  }
  
  static async dispatch(data: JobData = {}) {
    if(this === Job)
      throw new Error("Can not dispatch abstract Job class.");
    if(this.$options.shouldQueue) {
      const job = new (this as any)();
      const options: BullJobOptions = {
        delay: this.$options.dispatchAfter,
        attempts: job.tries,
        timeout: job.timeout
      };
      if(this.$options.cron) {
        options.repeat = { cron: this.$options.cron };
      }
      await Queue.channel(job.channel).add(this.name, data, options);
    }
    else await resolve<Job>(this).handle(data);
    this.resetOptions();
  }
}
