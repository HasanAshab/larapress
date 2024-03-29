import ServiceProvider from "~/core/providers/ServiceProvider";
import { container } from "tsyringe";
import { Mutex } from 'async-mutex';

export default class LockServiceProvider extends ServiceProvider {
  register() {
    container.register(Mutex, { useValue: new Mutex() });
  }
}