import Queue from "illuminate/queue/Queue";

export default abstract class Job {
  abstract dispatch(data: object): Promise<void>
  public shouldQueue = false;
  public concurrency = 1;
  
  constructor(public data: object) {
    this.data = data;
  }

  async exec(delay = 0) {
    if (this.shouldQueue || delay > 0) {
      const channel = "_JOB_" + this.constructor.name;
      Queue.set(channel, this.dispatch.bind(this), this.concurrency).add(this.data, {delay});
    } 
    else await this.dispatch(this.data);
  }
}