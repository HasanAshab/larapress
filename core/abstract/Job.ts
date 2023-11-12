import Queue from "Queue";
import nodeCron from "node-cron";

export interface JobOptions {
  shouldQueue: boolean;
  dispatchAfter: number;
  cron: string | null;
}

export default abstract class Job<Data = object> {
  channel = "default";
  concurrency = 1;
  tries = 1;
  timeout = 10000;
  
  private options: JobOptions = {
    shouldQueue: true,
    dispatchAfter: 0,
    cron: null
  };
  
  public abstract handle(data: Data): Promise<void>;
  
  delay(ms: number) {
    this.options.dispatchAfter = ms;
    return this;
  }
  
  withoutQueue() {
    this.options.shouldQueue = false;
    return this;
  }
  
  repeat(cron: string) {
    this.options.cron = cron;
    return this;
  }
  
  resetOptions() {
    this.options = {
      shouldQueue: true,
      dispatchAfter: 0,
      cron: null
    }
    return this;
  }
  
  async dispatch(data: Data) {
    if(this.options.cron)
      nodeCron.schedule(this.options.cron, () => this.exec(data));
    else await this.exec(data);
    this.resetOptions();
  }
  
  private async exec(data: Data) {
    if(!this.options.shouldQueue)
      return await this.handle(data);
    
    await Queue.channel(this.channel).add(this.constructor.name, data, {
      delay: this.options.dispatchAfter,
      attempts: this.tries,
      timeout: this.timeout
    });
  }
}
