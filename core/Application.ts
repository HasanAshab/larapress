import express, { Application as ExpressApplication } from "express";
import EventEmitter from "events";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import fs from "fs";
import config from "config";
import URL from "URL";
import { getStatusText } from "http-status-codes";
import DatabaseServiceProvider from "~/app/providers/DatabaseServiceProvider";
import EventServiceProvider from "~/app/providers/EventServiceProvider";
import RouteServiceProvider from "~/app/providers/RouteServiceProvider";

export default class Application extends EventEmitter {
  readonly http?: ExpressApplication;
  readonly providersBaseDir = "app/providers";
  private registeredProviders = [];
  private bootingCallbacks = [];

  async bootstrap() {
    if(this.runningInWeb()) {
      this.http = express();
      this.addCustomHttpHelpers();
    }
    this.registerBaseServiceProviders();
    await this.discoverExternalServiceProviders();
    await this.bootProviders();
    this.flush();
    this.booted = true;
    this.emit("booted");
  }
  
  private async bootProviders() {
    return Promise.all(this.bootingCallbacks.map(cb => cb()));
  }
  
  private registerBaseServiceProviders() {
    this.register(DatabaseServiceProvider);
    this.register(EventServiceProvider);
    this.register(RouteServiceProvider);
  }
  
  private async discoverExternalServiceProviders() {
    const providerFilesName = await fs.promises.readdir(this.providersBaseDir)
    const registerPromises = providerFilesName.map(fileName => this.foo(fileName));
    await Promise.all(registerPromises);
  }
  private async foo(fileName: string) {
    const { default: Provider } = await import("~/" + this.providersBaseDir + "/" + fileName);
    if(Provider.prototype instanceof ServiceProvider)
      this.register(Provider);
  }
  
  private addCustomHttpHelpers() {
    if (this.http) {
      this.http.response.message = function (text?: string) {
        this.json({
          success: this.statusCode >= 200 && this.statusCode < 300,
          message: text || getStatusText(this.statusCode),
        });
      };

      this.http.response.api = function (response) {
        const success = this.statusCode >= 200 && this.statusCode < 300;
        const apiResponse = {
          success,
          message: response.message || getStatusText(this.statusCode),
          data: response.data || response,
        };
        this.json(apiResponse);
        return apiResponse;
      };

      this.http.response.redirectToClient = function (path = '/') {
        return this.redirect(URL.client(path));
      };
    }
  }  
  
  private flush() {
    this.registeredProviders = [];
    this.bootingCallbacks = [];
  }
  
  runningInConsole(): asserts this is Omit<this, "http"> {
    return env("NODE_ENV") === "shell";
  }
  
  runningInWeb(): asserts this is this & { http: ExpressApplication } {
    return !this.runningInConsole();
  }
  
  private register(Provider) {
    if(this.registeredProviders.includes(Provider))
      return;
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      const cb = provider.boot.bind(provider);
      cb.namee = Provider.name
      this.bootingCallbacks.push(cb);
    }
    this.registeredProviders.push(Provider);
  }
}