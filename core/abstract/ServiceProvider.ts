import { Application } from "express";

export default abstract class ServiceProvider {
  constructor(public app: Application) {
    this.app = app;
  }

  abstract register?(): void;
  abstract boot?(): void;
}