const Queue = require("bull");
const redisUrl = process.env.REDIS_URL;

class Job {
  constructor(data) {
    this.data = data;
    this.shouldQueue = false;
  }

  async dispatch() {
    throw new Error("dispatch() method not implemented");
  }

  async exec(milliseconds) {
    if (!milliseconds) {
      return await this.dispatch(this.data);
    }
    this.shouldQueue = true;
    const myQueue = new Queue("my-queue", redisUrl);
    myQueue.process(async (job) => {
      await this.dispatch(this.data);
    });
    await myQueue.add(this.data, { delay: milliseconds });
  }
}

module.exports = Job;
