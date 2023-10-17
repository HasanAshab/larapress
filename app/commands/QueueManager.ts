import Command from "~/core/abstract/Command";
import { autoInjectable } from "tsyringe";
import Queue from "bull";
import fs from "fs";
import DB from "DB";

@autoInjectable()
export default class QueueManager extends Command {
  constructor(private readonly queue: Queue) {
    super();
  }
  
  async work(){
    await DB.connect();

    this.setupJobs();
    this.queue.on('failed', (job, err) => console.log(`Job ${job.name} failed for: ${err.stack}\n\n`))

    this.info("listening for jobs...")
  }
  
  private setupJobs() {
    fs.readdirSync("app/jobs").forEach(jobFileName => {
      const jobName = jobFileName.split(".")[0];
      const Job = require("~/app/jobs/" + jobName).default;
      const job = resolve(Job);
      const processor = (task: Queue.Job) => job.handle(task.data);
      this.queue.process(Job.name, job.concurrency, processor);
    });
  }
}