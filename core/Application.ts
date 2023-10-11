import express from "express";
import fs from "fs";
import config from "config";
import DatabaseServiceProvider from "~/app/providers/DatabaseServiceProvider";
import EventServiceProvider from "~/app/providers/EventServiceProvider";
import RouteServiceProvider from "~/app/providers/RouteServiceProvider";

/*
export default class Application {
  private registeredProviders = [];
  private bootingCallbacks = [];
  
  constructor() {
    const app = express();
      console.log(this)
    Object.assign(app, this);
    return app
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
  
  register(Provider) {
    if(this.registeredProviders.includes(Provider))
      return;
    console.log(Provider)
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
    this.registeredProviders.push(Provider);
  }


  bootstrap() {
    this.registerBaseServiceProviders();
    this.discoverExternalServiceProviders();
    this.bootProviders();
  }
}
*/

export default function Application() {
  const app = express();

  app.registeredProviders = [];
  app.bootingCallbacks = [];
  
  app.bootProviders = function() {
    this.bootingCallbacks.forEach(cb => cb());
  }
  
  app.registerBaseServiceProviders = function() {
    this.register(DatabaseServiceProvider);
    this.register(EventServiceProvider);
    this.register(RouteServiceProvider);
  }
  
  app.discoverExternalServiceProviders = function() {
    const providersBaseDir = "app/providers";
    const providersFullName = fs.readdirSync(providersBaseDir);
    for(const providerFullName of providersFullName){
      const Provider = require("~/" + providersBaseDir + "/" + providerFullName.split(".")[0]).default;
      this.register(Provider);
    }
  }

  app.register = function(Provider) {
    if(this.registeredProviders.includes(Provider))
      return;
    const provider = new Provider(this);
    provider.register?.();
    if (provider.boot) {
      this.bootingCallbacks.push(provider.boot.bind(provider));
    }
    this.registeredProviders.push(Provider);
  }
  
  app.bootstrap = function() {
    this.registerBaseServiceProviders();
    this.discoverExternalServiceProviders();
    this.bootProviders();
  }

  return app;
}
