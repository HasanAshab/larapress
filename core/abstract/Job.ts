import Queue from "Queue";
import { log } from "helpers";

export default abstract class Job<T = object> {
  abstract handle(data: T): Promise<void>;
  public static concurrency = 1;

  static dispatch(data: T): {
    then: Promise<void>["then"],
    delay: (ms: number) => void
  } {
    const job = new this();
    const pushQueue = (ms = 0) => {
      const channel = `$JOB_${this.name}`;
      const processor = _ => job.handle(_.data).catch(log);
      Queue.set(channel, processor, job.concurrency);
      Queue.pushOn(channel, data, { delay: ms });
    };

    return {
      then: pushQueue,
      delay: pushQueue,
    };
  }
  
  static async exec(data: T) {
    const job = new (this as any)();
    await job.handle(data);
  }
}
