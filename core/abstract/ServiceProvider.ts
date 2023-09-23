import { Application } from "express";

export default abstract class ServiceProvider {
  abstract register?(): void;
  abstract boot?(): void;
  
  constructor(public app: Application) {
    this.app = app;
  }
}