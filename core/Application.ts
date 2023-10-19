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
  private registeredProviders = [];
  private bootingCallbacks = [];

  constructor() {
    super();
    if(this.runningInWeb()) {
      this.http = express();
      this.addCustomHttpHelpers();
    }
    this.registerBaseServiceProviders();
    this.discoverExternalServiceProviders();
    this.bootProviders();
    this.emit("booted");
  }
  
  private bootProviders() {
    this.bootingCallbacks.forEach(cb => cb());
  }
  
  private registerBaseServiceProviders() {
    this.register(DatabaseServiceProvider);
    this.register(EventServiceProvider);
    this.register(RouteServiceProvider);
  }
  
  private discoverExternalServiceProviders() {
    const providersBaseDir = "app/providers";
    const providersFullName = fs.readdirSync(providersBaseDir);
    for(const providerFullName of providersFullName){
      const Provider = require("~/" + providersBaseDir + "/" + providerFullName.split(".")[0]).default;
      if(Provider.prototype instanceof ServiceProvider)
        this.register(Provider);
    }
  }
  
  private addCustomHttpHelpers() {
    const responseHelpers = {
      message(text?: string) {
        this.json({
          success: this.statusCode >= 200 && this.statusCode < 300,
          message: text ?? getStatusText(this.statusCode)
        });
      },
      api(response: RawResponse) {
        const success = this.statusCode >= 200 && this.statusCode < 300;
        (response as any).message = (response as any).message ?? getStatusText(this.statusCode);
        
        if((response as any).data) {
          (response as any).success = (response as any).success ?? success;
          this.json(response);
          return response as ApiResponse;
        }
        
        const apiResponse: ApiResponse = { success };
        apiResponse.message = (response as any).message
        delete (response as any).message;
        apiResponse.data = response;
        this.json(apiResponse);
      },
      redirectToClient(path = "/") {
        return this.redirect(URL.client(path));
      }
    }
    Object.assign(this.http.response, responseHelpers);
  }
  
  runningInConsole(): asserts this is Omit<this, "http"> {
    return env("NODE_ENV") === "shell";
  }
  
  runningInWeb(): asserts this is this & { http: ExpressApplication } {
    return !this.runningInConsole();
  }
  
  register(Provider) {
    if(this.registeredProviders.includes(Provider))
      return;
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
    this.registeredProviders.push(Provider);
  }
}