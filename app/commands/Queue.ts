import Command from "~/core/abstract/Command";
import queue from "~/core/clients/queue";
import fs from "fs";
import DB from "DB";

export default class Queue extends Command {
  async work(){
    await DB.connect();
    this.setupJobs()
    this.info("listening for jobs...")
  }
  
  private setupJobs() {
    fs.readdirSync("app/jobs").forEach(jobFileName => {
      const jobName = jobFileName.split(".")[0];
      const Job = require("~/app/jobs/" + jobName).default;
      const job = new Job();
      const processor = (task: Queue.Job) => job.handle(task.data);
      queue.process(jobName, job.concurrency, processor);
    });
    
    queue.on('failed', (job, err) => log(`Job ${job.name} failed for: ${err.stack}\n\n`))
  }
}