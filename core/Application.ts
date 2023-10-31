import { createServer } from "http"
import express, { Application as ExpressApplication } from "express";
import EventEmitter from "events";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import fs from "fs";
import Config from "Config";
import URL from "URL";
import { getStatusText } from "http-status-codes";


/**
* The Core Application class.
* It is the place where all the providers are booted
*/
export default class Application extends EventEmitter {
  /**
  * The HTTP handler (express)
  */
  readonly http?: ExpressApplication;
  
  /**
   * The HTTP server
  */
  readonly server?;
  
  /**
  * Booting callback of all providers
  */
  private bootingCallbacks = [];

  /**
   * Create a Application instance
  */ 
  constructor() {
    super();
    if(this.runningInWeb()) {
      // if app is running on web we need http support
      this.createHttpServer();
      this.addCustomHttpHelpers();
    }
    this.registerServiceProviders();
    this.bootProviders();
    this.emit("booted");
    this.flush();
  }
  
  /**
   * Run all booting callbacks
  */
  private bootProviders() {
    this.bootingCallbacks.forEach(cb => cb());
  }
  
  /**
   * Register all service providers
  */
  private registerServiceProviders() {
    Config.get("app.providers").forEach(path => {
      this.register(require(path).default);
    });
  }
  
  /**
   * Create http server (express)
  */
  private createHttpServer() {
    this.http = express();
    this.server = createServer(this.http);
  }
  
  /**
   * Customize the HTTP (Express)
  */
  private addCustomHttpHelpers() {
    if (!this.http)
      throw new Error("Http server (express) was not created.");
    
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
  
  /**
   * Flush booting callbacks list
  */
  private flush() {
    this.bootingCallbacks = [];
  }
  
  /**
   * Wether the app is running in console
  */
  runningInConsole(): asserts this is Omit<this, "http"> {
    return env("NODE_ENV") === "shell";
  }
  
  /**
   * Wether the app is running in web (HTTP)
  */
  runningInWeb(): asserts this is this & { http: ExpressApplication } {
    return !this.runningInConsole();
  }
  
  /**
   * Register a provider
  */
  private register(Provider) {
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
  }
}