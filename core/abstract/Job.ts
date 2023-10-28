import Queue from "Queue";

export default abstract class Job {
  static $options = {
    shouldQueue: true,
    dispatchAfter: 0,
    cron: null
  }

  public channel = "default";
  public concurrency = 1;
  public tries = 1;
  public timeout = 10000;
  
  abstract public handle(data: unknown): Promise<void>;
  
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
    this.$options.shouldQueue = true;
    this.$options.dispatchAfter = 0;
    this.$options.cron = null;
  }
  
  static async dispatch(data: unknown) {
    if(this.$options.shouldQueue) {
      const job = new this();
      const options = {
        delay: this.$options.dispatchAfter,
        attempts: job.tries,
        timeout: job.timeout
      };
      if(this.$options.cron) {
        options.repeat = { cron: this.$options.cron };
      }
      await Queue.channel(job.channel).add(this.name, data, options);
    }
    else await resolve(this).handle(data);
    this.resetOptions();
  }
}
