import expect from "expect";
import MockDataContainer from "~/tests/MockDataContainer";

export default abstract class Job {
  channel = "default";
  concurrency = 1;
  tries = 1;
  timeout = 10000;
  
  private options = {
    shouldQueue: true,
    dispatchAfter: 0
  };
  
  constructor() {
    this.mockClear();
  }
  
  abstract handle(data: any): Promise<void>;
  
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
  
  async dispatch(data: unknown) {
    MockDataContainer.Job.push(this)
    this.resetOptions();
  }
  
  mockClear() {
    MockDataContainer.Job = []
  }
  
  assertDispatched(job = this) {
    expect(MockDataContainer.Job).toContain(job)
  }
}