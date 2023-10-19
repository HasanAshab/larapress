import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import Queue from 'bull';
import config from "config";
import IORedis from "ioredis";

export default class QueueServiceProvider extends ServiceProvider {
  async register() {
    const queue = new Queue("default", config.get("cache.stores.redis.url"), config.get("queue"));
    container.register(Queue, { useValue: queue });
  }
}