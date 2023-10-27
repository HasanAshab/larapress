import Command from "~/core/abstract/Command";
import { autoInjectable } from "tsyringe";
import Queue from "Queue";
import fs from "fs";
import DB from "DB";


export default class QueueWorker extends Command {
  static signature = "queue:work";
  
  async handle(){
    await DB.connect();
    this.setupJobs();
    Queue.on('failed', (job, err) => console.log(`Job ${job.name} failed for: ${err.stack}\n\n`))
    Queue.on('completed', (job) => this.info(`[${this.formatedDate()}] Processed: ${job.name} \n`));
    this.info("listening for jobs...\n\n");
  }
  
  private formatedDate() {
    return new Date().toLocaleTimeString("en-US", { hour12: true });
  }
  
  private setupJobs() {
    fs.readdirSync("app/jobs").forEach(jobFileName => {
      const jobName = jobFileName.split(".")[0];
      const Job = require("~/app/jobs/" + jobName).default;
      const job = resolve(Job);
      const processor = (task: Queue.Job) => job.handle(task.data);
      Queue.channel(job.channel).process(Job.name, job.concurrency, processor);
    });
  }
}