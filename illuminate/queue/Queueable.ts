import Queue from "bull";
const redisUrl = process.env.REDIS_URL || '';

export default abstract class Queueable {
  createQueue(name?: string): Queue.Queue {
    return new Queue(name || this.constructor.name, redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
}