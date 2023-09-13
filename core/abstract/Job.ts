import Queue from "Queue";
import { log } from "helpers";

export default abstract class Job {
  abstract handle(data: unknown): Promise<void>;
  public static concurrency = 1;

  static dispatch(data: unknown) {
    const job = new this();
    const pushQueue = (ms = 0) => {
      const channel = `$JOB_${this.name}`;
      const processor = (_: any) => job.handle(_.data).catch(log);
      Queue.set(channel, processor, job.concurrency);
      Queue.pushOn(channel, data, { delay: ms });
    };

    return {
      then: pushQueue as Promise<void>["then"],
      delay: pushQueue,
    };
  }
  
  static async exec(data: unknown) {
    const job = new (this as any)();
    await job.handle(data);
  }
}
