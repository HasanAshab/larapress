import { Command } from "samer-artisan";
import Job from "~/core/abstract/Job";
import Queue from "Queue";
import fs from "fs";
import DB from "DB";


export default class QueueWorker extends Command {
  signature = "queue:work";
  
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
      const JobClass = require("~/app/jobs/" + jobName).default;
      const job = resolve<Job>(JobClass);
      const processor = (task: any) => job.handle(task.data);
      Queue.channel(job.channel).process(JobClass.name, job.concurrency, processor);
    });
  }
}