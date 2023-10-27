import Queue from "Queue";

export default abstract class Job {
  static $options = {
    shouldQueue: true,
    dispatchAfter: 0
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
  
  static resetOptions() {
    this.$options.shouldQueue = true;
    this.$options.dispatchAfter = 0;
  }
  
  static async dispatch(data: unknown) {
    if(this.$options.shouldQueue) {
      const job = new this();
      const options = {
        delay: this.$options.dispatchAfter,
        attempts: job.tries,
        timeout: job.timeout
      };
      await Queue.channel(job.channel).add(this.name, data, options);
    }
    else await resolve(this).handle(data);
    this.resetOptions();
  }
}
