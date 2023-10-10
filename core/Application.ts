import express from "express";
import fs from "fs";
import config from "config";
import DatabaseServiceProvider from "~/app/providers/DatabaseServiceProvider";

export default class Application {
  constructor() {
    Object.assign(this, express())
  }
  bootstrap() {
    const bootMethods = [];
    for(const path of config.get("app.providers")){
      const Provider = require(path).default;
      const provider = new Provider(this);
      provider.register?.();
      provider.boot && bootMethods.push(provider.boot.bind(provider));
    }
    bootMethods.forEach(bootMethod => bootMethod());
  }
}

