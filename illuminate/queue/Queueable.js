const Queue = require("bull");
const redisUrl = process.env.REDIS_URL;

class Queueable {
  setQueue(){
    this.queue = new Queue(this.constructor.name, redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
}

module.exports = Queueable;
