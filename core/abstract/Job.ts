import Queue from "Queue";

export default abstract class Job<Data = object> {
  channel = "default";
  concurrency = 1;
  tries = 1;
  timeout = 10000;
  
  private options = {
    shouldQueue: true,
    dispatchAfter: 0
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
  

  resetOptions() {
    this.options = {
      shouldQueue: true,
      dispatchAfter: 0
    }
    return this;
  }
  
  async dispatch(data: Data) {
    await this.exec(data);
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
