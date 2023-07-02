import { log } from "helpers"
import bull from "bull";

export default class Queue {
  static queue: bull.Queue;
  
  constructor(public channel: string){
    this.channel = channel;
  }
  
  static set(channel: string, worker: (data: object) => Promise<void>, concurrency = 1) {
    if(typeof this.queue === "undefined"){
      this.queue = new bull("default", process.env.REDIS_URL ?? "", {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
    }
    if(typeof (this.queue as any).handlers[channel] === "undefined") {
      const processor = (job: bull.Job) => worker(job.data).catch(err => log(err));
      this.queue.process(channel, concurrency, processor);
    }
    return new this(channel)
  }
  
  add(data: object, opts?: bull.JobOptions){
    return Queue.queue.add(this.channel, data, opts);
  }
}