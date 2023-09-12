import Queue from "Queue";
import { log } from "helpers";

export default abstract class Job<T = object> {
  abstract handle(): Promise<void>;
  public static concurrency = 1;

  static dispatch(data?: T): {
    then: Promise<void>["then"],
    delay: (ms: number) => void
  }
    {
    const job = new this(data);

    const executeWithDelay = (ms: number) => {
      const channel = `$JOB_${this.name}`;
      const processor = () => job.handle().catch(log);
      Queue.set(channel, processor, job.concurrency).add({}, { delay: ms });
    };

    return {
      then: (cb, errHandler) => job.handle().then(cb).catch(errHandler),
      delay: executeWithDelay,
    };
  }
}
