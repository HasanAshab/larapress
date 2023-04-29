const Queueable = require(base('illuminate/queue/Queueable'));

class Job extends Queueable {
  constructor(data) {
    super()
    this.data = data;
  }

  async dispatch() {
    throw new Error("dispatch() method not implemented");
  }

  async exec(milliseconds) {
    if (milliseconds) {
      this.setQueue();
      this.queue.process(job => this.dispatch(job.data));
      await this.queue.add(this.data, { delay: milliseconds });
    } else {
      await this.dispatch(this.data);
    }
  }
}

module.exports = Job;
