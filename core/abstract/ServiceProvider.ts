import { Application } from "express";

export default abstract class ServiceProvider {
  constructor(public app: Application) {
    this.app = app;
  }
  
  register(): void {}
  boot(): void {}
  
}