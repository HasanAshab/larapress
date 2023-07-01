import { log } from "helpers"
import bull, { JobOpts } from "bull";

export default class Queue {
  static queue: bull.Queue;
  
  constructor(public channel: string){
    this.channel = channel;
  }
  
  static set(channel: string, worker: (data: object) => Promise<void>, concurrency = 1): bull.Queue {
    if(typeof this.queue === "undefined"){
      this.queue = new bull("default", process.env.REDIS_URL ?? "", {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
    }
    if(typeof this.queue.handlers[channel] === "undefined") {
      const processor = job => worker(job.data).catch(err => log(err));
      this.queue.process(channel, concurrency, processor);
    }
    return new this(channel)
  }
  private add(data: object, opts?: JobOpts){
    return this.constructor.queue.add(this.channel, data, opts);
  }
}