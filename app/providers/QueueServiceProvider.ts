import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import Queue from 'bull';
import Config from "Config";

export default class QueueServiceProvider extends ServiceProvider {
  register() {
    const queue = new Queue("default", Config.get("cache.stores.redis.url"), Config.get("queue"));
    container.register("Queue", { useValue: queue });
  }
}