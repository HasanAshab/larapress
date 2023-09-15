import { log } from "helpers";
import Queue from 'bull';
import fs from "fs";
import config from "config";

const queue = new Queue("default", config.get("redis.url"), {
  defaultJobOptions: { removeOnComplete: true }
});

fs.readdirSync("app/jobs").forEach(jobFileName => {
  const jobName = jobFileName.split(".")[0];
  const Job = require("~/app/jobs/" + jobName).default;
  const job = new Job();
  const processor = (task: Queue.Job) => job.handle(task.data);
  queue.process(jobName, job.concurrency, processor);
});

queue.on('failed', (job, err) => log(err))
export default queue;
