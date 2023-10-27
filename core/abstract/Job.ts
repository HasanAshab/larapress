const Queue = use("Queue");

export default abstract class Job {
  static shouldQueue = true;
  static dispatchAfter = 0;
  
  public concurrency = 1;
  public tries = 1;
  public timeout = 10000;
  abstract handle(data: unknown): Promise<void>;
  
  static delay(ms: number) {
    this.dispatchAfter = ms;
    return this;
  }
  
  static withoutQueue() {
    this.shouldQueue = false;
    return this;
  }
  
  static resetOptions() {
    this.shouldQueue = true;
    this.dispatchAfter = 0;
  }
  
  static async dispatch(data: unknown) {
    if(this.shouldQueue) {
      const job = new this();
      const options = {
        delay: this.dispatchAfter,
        attempts: job.tries,
        timeout: job.timeout
      };
      await Queue.add(this.name, data, options);
    }
    else await resolve(this).handle(data);
    this.resetOptions();
  }
}
