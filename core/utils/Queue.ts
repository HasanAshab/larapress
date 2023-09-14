import { log } from "helpers";
import Queue from 'bull';
import fs from "fs";
import config from "config";

const queue = new Queue("default", config.get("redis.url"));


fs.readdirSync("app/jobs").forEach(jobFileName => {
  const jobName = jobFileName.split(".")[0];
  const Job = require("~/app/jobs/" + jobName).default;
  const job = new Job();
  const processor = (_) => job.handle(_.data).catch(log);
  queue.process(jobName, job.concurrency, processor);
});


export default queue;
