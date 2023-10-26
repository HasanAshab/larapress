import Queue from "bull";
import MockDataContainer from "~/tests/MockDataContainer";

export default abstract class Job {
  static shouldQueue = true;
  static dispatchAfter = 0;
  public concurrency = 1;
  public tries = 1;
  public timeout = 10000;
  abstract handle(data: unknown): Promise<void>;
  
  static mockClear() {
    MockDataContainer.Job = [this.name]
  }
  
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
    MockDataContainer.Job.push(this.name)
    this.resetOptions();
  }
  
  static assertDispatched(job: typeof Job = Job.name) {
    expect(MockDataContainer.Job).toContain(job)
  }
}

Job.mockClear();
