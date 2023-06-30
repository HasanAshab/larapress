import Queue from "illuminate/queue/Queue";

export default abstract class Job {
  abstract dispatch(): void | Promise<void>
  public shouldQueue = false;
  
  constructor(public data: object) {
    this.data = data;
  }

  async exec(delay = 0) {
    if (Queue.isQueueable(this)) {
      const processor = job => this.dispatch.call(this, job.data)
      Queue.get(this.queueChannel, processor).add(this.data, { delay });
    } 
    else await this.dispatch(this.data);
  }
}