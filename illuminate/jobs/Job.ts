import Queue from "illuminate/queue/Queue";

export default abstract class Job {
  abstract dispatch(): void | Promise<void>
  public shouldQueue = false;
  
  constructor(public data: object) {
    this.data = data;
  }

  async exec(delay = 0) {
    if (this.shouldQueue || delay > 0) {
      const processor = job => this.dispatch.call(this, job.data)
      Queue.set(this.constructor.name, processor).add(this.constructor.name, this.data, {delay});
    } 
    else await this.dispatch(this.data);
  }
}