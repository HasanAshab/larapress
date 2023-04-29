const Queue = require("bull");
const redisUrl = process.env.REDIS_URL;

class Queueable {
  setQueue(name){
    this.queue = new Queue(name || this.constructor.name, redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
}

module.exports = Queueable;
