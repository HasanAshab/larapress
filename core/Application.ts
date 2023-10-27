import { createServer } from "http"
import express, { Application as ExpressApplication } from "express";
import EventEmitter from "events";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import fs from "fs";
import Config from "Config";
import URL from "URL";
import { getStatusText } from "http-status-codes";

export default class Application extends EventEmitter {
  readonly http?: ExpressApplication;
  readonly server?;
  readonly providersBaseDir = "app/providers";
  //private registeredProviders = [];
  private bootingCallbacks = [];

  constructor() {
    super();
    if(this.runningInWeb()) {
      this.http = express();
      this.server = createServer(this.http);
      this.addCustomHttpHelpers();
    }
    this.registerServiceProviders();
    this.bootProviders();
    this.emit("booted");
    this.flush();
  }
  
  private bootProviders() {
    this.bootingCallbacks.forEach(cb => cb());
  }
    
  private registerServiceProviders() {
    Config.get("app.providers").forEach(path => {
      this.register(require(path).default);
    });
  }
  
  private addCustomHttpHelpers() {
    if (!this.http)
      throw new Error("Http (express) is not created.");
    
    this.http.request.files = {};
    
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
   // this.registeredProviders = [];
    this.bootingCallbacks = [];
  }
  
  runningInConsole(): asserts this is Omit<this, "http"> {
    return env("NODE_ENV") === "shell";
  }
  
  runningInWeb(): asserts this is this & { http: ExpressApplication } {
    return !this.runningInConsole();
  }
  
  private register(Provider) {
    //if(this.registeredProviders.includes(Provider))
     // return;
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
    //this.registeredProviders.push(Provider);
  }
}