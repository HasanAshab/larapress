import bull from "bull";

export default class Queue {
  static queue: bull.Queue;
  
  static set(channel: string, processor: Function): bull.Queue {
    if(typeof this.queue === "undefined"){
      this.queue = new bull("default", process.env.REDIS_URL ?? "", {
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
    }
    if(typeof this.queue.handlers[channel] === "undefined") {
      this.queue.process(channel, processor);
    }
    //console.log(this.queue.handlers)
    return this.queue;
  }
}