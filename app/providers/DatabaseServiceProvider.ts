import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from 'config';
import mongoose from "mongoose";
import fs from "fs";

export default class DatabaseServiceProvider extends ServiceProvider {
  boot() {
    this.useGlobalPlugins();
    this.discoverModels();
  }
  
  private discoverModels() {
    const modelsBaseDir = "app/models";
    fs.readdirSync(modelsBaseDir).forEach(modelFullName => {
      require("~/" + modelsBaseDir + "/" + modelFullName.split(".")[0]);
    });
  }
  
  private useGlobalPlugins() {
    const globalPluginsBaseDir = "core/global/plugins";
    fs.readdirSync(globalPluginsBaseDir).forEach(globalPluginName => {
      const plugin = require("~/" + globalPluginsBaseDir + "/" + globalPluginName.split(".")[0]).default;
      mongoose.plugin(plugin);
    });
  }
}