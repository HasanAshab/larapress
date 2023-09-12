import { log } from "helpers";
import config from "config";
import bull from "bull";

export default class Queue {
  static queue: bull.Queue;

  static set(channel: string, processor: (job: bull.Job) => Promise<void>, concurrency = 1) {
    if(!this.queue){
      this.queue = new bull("default", config.get<string>("redis.url"), {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
    }
    if(!(this.queue as any).handlers[channel]) {
      this.queue.process(channel, concurrency, processor);
    }
  }
  
  static pushOn(channel: string, data: object, opts?: bull.JobOptions){
    return this.queue.add(channel, data, opts);
  }
}