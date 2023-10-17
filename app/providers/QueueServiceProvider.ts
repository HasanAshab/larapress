import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import Queue from 'bull';
import config from "config";
import IORedis from "ioredis";

export default class QueueServiceProvider extends ServiceProvider {
  register() {
    const queue = new Queue("default", {
      createClient: type => container.resolve(IORedis),
      ...config.get("queue")
    });

    container.register(Queue, { useValue: queue });
  }
}