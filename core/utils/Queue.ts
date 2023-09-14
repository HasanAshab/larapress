import { log } from "helpers";
import { Queue, Worker } from 'bullmq';
import IORedis from "ioredis";
import { client } from "~/core/utils/Cache/drivers/Redis";
import fs from "fs";

const jobs = {};

shipJobs()

export default new Queue("default", { connection: client });

export const worker = new Worker("default", task => {
  const job = jobs[task.name];
  if(!job)
    log(new Error(`Job ${task.name} not found!`))
  return job.handle(task.data).catch(log);
}, { connection: client });


function shipJobs() {
  fs.readdirSync("app/jobs").forEach(jobFileName => {
    const jobName = jobFileName.split(".")[0];
    jobs[jobName] = new (require("~/app/jobs/" + jobName).default);
  });
}