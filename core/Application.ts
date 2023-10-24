import { createServer } from "http"
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
  readonly server?;
  readonly providersBaseDir = "app/providers";
  private registeredProviders = [];
  private bootingCallbacks = [];

  constructor() {
    super();
    if(this.runningInWeb()) {
      this.http = express();
      this.server = createServer(this.http);
      this.addCustomHttpHelpers();
    }
    this.registerBaseServiceProviders();
    this.discoverExternalServiceProviders();
    this.bootProviders();
    this.emit("booted");
    this.flush();
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
      this.register(Provider);
    }
  }
  
  private addCustomHttpHelpers() {
    if (!this.http)
      throw new Error("Http (express) is not created.");
      
    this.http.request.fullUrl = function() {
      return this.protocol + '://' + this.get('host') + this.originalUrl;
    }
    
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
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
    this.registeredProviders.push(Provider);
  }
}