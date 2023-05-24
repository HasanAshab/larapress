import Queue from "bull";
import ShouldQueue from "illuminate/queue/ShouldQueue";
import { checkProperties } from "helpers";

export default abstract class Queueable {
  createQueue(name?: string): Queue.Queue {
    const redisUrl = process.env.REDIS_URL || "";
    return new Queue(name || this.constructor.name, redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }

  static isQueueable(target: any): target is ShouldQueue {
    return checkProperties(target, {
      shouldQueue: "boolean", 
      createQueue: "function"
    });
  }
}