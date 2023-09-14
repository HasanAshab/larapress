import { log } from "helpers";
import Queue from "Queue";

export default abstract class Job {
  static shouldQueue = true;
  static dispatchAfter = 0;
  
  public concurrency = 1;
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
    if(this.shouldQueue)
      Queue.add(this.name, data, { delay: this.dispatchAfter }).catch(log);
    else {
      const job = new (this as any)();
      await job.handle(data);
    }
    this.shouldQueue = true;
    this.dispatchAfter = 0;
  }
}
