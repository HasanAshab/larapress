import fs from "fs";
import config from "config";
import DatabaseServiceProvider from "~/app/providers/DatabaseServiceProvider";

export default class Setup {
/*
  static bootstrap(app: Application) {
    const providersBaseDir = "app/providers";
    const providersFullName = fs.readdirSync(providersBaseDir);
    for(const providerFullName of providersFullName){
      const Provider = require("~/" + providersBaseDir + "/" + providerFullName.split(".")[0]).default;
      const provider = new Provider(app);
      provider.register?.();
      provider.boot?.();
    }
  }
  */
  static bootstrap(app: Application) {
    const bootMethods = [];
    for(const path of config.get("app.providers")){
      const Provider = require(path).default;
      const provider = new Provider(app);
      provider.register?.();
      provider.boot && bootMethods.push(provider.boot.bind(provider));
    }
    bootMethods.forEach(bootMethod => bootMethod());
  }

}