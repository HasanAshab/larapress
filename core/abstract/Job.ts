import { log } from "~/core/utils";
import queue from "~/core/clients/queue";

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
  
  static async dispatch(data: unknown) {
    const job = new (this as any)();
    if(this.shouldQueue)
      queue.add(this.name, data, { delay: this.dispatchAfter, attempts: job.tries, timeout: job.timeout }).catch(log);
    else await job.handle(data);
    this.shouldQueue = true;
    this.dispatchAfter = 0;
  }
}
