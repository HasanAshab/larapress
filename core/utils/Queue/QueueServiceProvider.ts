import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import QueueManager from "./QueueManager";

export default class QueueServiceProvider extends ServiceProvider {
  register() {
    container.register("Queue", { useValue: new QueueManager() });
  }
}