import bull from "bull";
import ShouldQueue from "illuminate/queue/ShouldQueue";
import { checkProperties } from "helpers";

export default class Queue {
  static queues: Record<string, bull.Queue> = {}
  
  static get(channelName: string, processor: Function): bull.Queue {
    if(typeof this.queues[channelName] === "undefined"){
      const queue = new bull(channelName, process.env.REDIS_URL ?? "", {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
      queue.process(processor);
      this.queues[channelName] = queue;
    }
    return this.queues[channelName];
  }
  
  static isQueueable(target: any): target is ShouldQueue {
    return checkProperties(target, {
      queueChannel: "string"
    });
  }
}