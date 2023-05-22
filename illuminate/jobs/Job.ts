import Queueable from "illuminate/queue/Queueable";
import ShouldQueue from "illuminate/queue/ShouldQueue";

export default abstract class Job extends Queueable implements ShouldQueue {
  abstract dispatch(): void | Promise<void>
  public shouldQueue = false;
  
  constructor(public data: {[key: string]: any}) {
    super()
    this.data = data;
  }

  async exec(milliseconds?: number) {
    if (typeof milliseconds !== "undefined") {
      this.shouldQueue = true;
      const queue = this.createQueue();
      queue.process(job => this.dispatch.bind(this));
      await queue.add({}, { delay: milliseconds });
    } 
    else await this.dispatch();
  }
}