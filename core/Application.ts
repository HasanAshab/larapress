import { RawResponse } from "types";
import { createServer, Server } from "http"
import express, { Express } from "express";
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
  readonly http?: Express;
  
  /**
   * The HTTP server
   */
  readonly server?: Server;
  
  /**
  * Booting callback of all providers
  */
  private bootingCallbacks: (() => void)[] = [];

  /**
   * Create a Application instance
  */ 
  constructor() {
    super();
    if(this.runningInWeb()) {
      // if app is running on web we need http support
      this.http = express();
      this.server = createServer(this.http);
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
    Config.get<string[]>("app.providers").forEach(path => {
      this.register(require(path).default);
    });
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
  runningInConsole(): this is Omit<this, "http" | "server"> {
    return env("NODE_ENV") === "shell";
  }
  
  /**
   * Wether the app is running in web (HTTP)
  */
  runningInWeb(): this is this & { http: Express, server: Server } {
    return !this.runningInConsole();
  }
  
  /**
   * asserts app is running in console
  */
  assertRunningInConsole(): asserts this is Omit<this, "http" | "server"> {
    if(!this.runningInConsole())
      throw new Error("Application is not running in console.");
  }
  
  /**
   * asserts app is running in web (HTTP)
  */
  assertRunningInWeb(): asserts this is this & { http: Express, server: Server } {
    if(!this.runningInWeb())
      throw new Error("Application is not running in web.");
  }
  
  /**
   * Register a provider
  */
  private register(Provider: typeof ServiceProvider) {
    const provider = new (Provider as any)(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
  }
}