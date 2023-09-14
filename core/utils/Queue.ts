import { log } from "helpers";
import { Queue, Worker } from 'bullmq';
import IORedis from "ioredis";
import { client } from "~/core/utils/Cache/drivers/Redis";

export default new Queue("default", { connection: client });

export const worker = new Worker("default", task => {
  const Job = require("~/app/jobs/" + task.name).default;
  const job = new Job();
  return job.handle(task.data).catch(log);
}, { connection: client });


