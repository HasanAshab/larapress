import Queue from 'bull';
import config from "config";

const queue = new Queue("default", config.get("cache.stores.redis.url"), {
  defaultJobOptions: { removeOnComplete: true }
});

export default queue;
