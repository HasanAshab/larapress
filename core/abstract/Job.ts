import Queue from "Queue";

export default abstract class Job<
  Data extends object | never = never,
  JobArguments = (Data extends object ? [data: Data] : [])
> {
  channel = "default";
  concurrency = 1;
  tries = 1;
  timeout = 10000;
  
  private options = {
    shouldQueue: true,
    dispatchAfter: 0
  };
  
  public abstract handle(...args: JobArguments): Promise<void>;
  
  delay(ms: number) {
    this.options.dispatchAfter = ms;
    return this;
  }
  
  withoutQueue() {
    this.options.shouldQueue = false;
    return this;
  }
  

  resetOptions() {
    this.options = {
      shouldQueue: true,
      dispatchAfter: 0
    }
    return this;
  }
  
  async dispatch(...args: JobArguments) {
    await this.exec(args[0]);
    this.resetOptions();
  }
  
  private async exec(...args: JobArguments) {
    if(!this.options.shouldQueue)
      return await this.handle(args[0]);
    
    await Queue.channel(this.channel).add(this.constructor.name, args[0], {
      delay: this.options.dispatchAfter,
      attempts: this.tries,
      timeout: this.timeout
    });
  }
}
