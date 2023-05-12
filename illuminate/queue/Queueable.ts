import Queue from "bull";
const redisUrl = process.env.REDIS_URL;

export default abstract class Queueable {
  public queue: Queue.Queue;

  setQueue(name?: string): void {
    this.queue = new Queue(name || this.constructor.name, redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
}