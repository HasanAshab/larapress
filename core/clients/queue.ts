import { log } from "~/core/utils";
import Queue from 'bull';
import fs from "fs";
import config from "config";

const queue = new Queue("default", config.get("redis.url"), {
  defaultJobOptions: { removeOnComplete: true }
});

export default queue;
