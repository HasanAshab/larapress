import Queue from "~/core/queue/Queue";
import { log } from "helpers";

export default abstract class Job<T = object> {
  abstract handle(): Promise<unknown>;
  //public static shouldQueue = false;
  public static concurrency = 1;

  static dispatch(data?: object) {
    const job = new this(data);

    const executeWithDelay = (ms: number) => {
      const channel = `$JOB_${this.name}`;
      const processor = () => job.handle().catch(log);
      Queue.set(channel, processor, job.concurrency).add({}, { delay: ms });
    };

    return {
      then: () => job.handle(),
      delay: executeWithDelay,
    };
  }
}
