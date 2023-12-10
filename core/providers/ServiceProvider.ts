import type Application from "~/core/Application";

export default abstract class ServiceProvider {
  constructor(public app: Application) {
    this.app = app;
  }
  
  register(): void | Promise<void> {}
  boot(): void | Promise<void> {}
  
}