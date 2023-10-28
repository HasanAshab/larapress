import ServiceProvider from "~/core/abstract/ServiceProvider";
import { container } from "tsyringe";
import StorageManager from "./StorageManager";

export default class StorageServiceProvider extends ServiceProvider {
  register() {
    container.register("Storage", { useValue: new StorageManager() });
  }
}