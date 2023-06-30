import bull from "bull";
import ShouldQueue from "illuminate/queue/ShouldQueue";
import { checkProperties } from "helpers";

export default class Queue {
  static queue: bull.Queue;
  
  static get(processor: Function): bull.Queue {
    if(typeof this.queue === "undefined"){
      this.queue = new bull("default", process.env.REDIS_URL ?? "", {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
      this.queue.process(processor);
    }
    return this.queue;
  }
  
  static clear(){
    this.queue.process(null);
  }
  
  static isQueueable(target: any): target is ShouldQueue {
    return checkProperties(target, {
      queueChannel: "string"
    });
  }
}