import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from 'config';
import mongoose from "mongoose";
import fs from "fs";

export default class DatabaseServiceProvider extends ServiceProvider {
  boot() {
    this.useGlobalPlugins();
    this.registerModels();
  }
  
  private registerModels() {
    const modelsBaseDir = "app/models";
    const modelsFullName = fs.readdirSync(modelsBaseDir);
    for(const modelFullName of modelsFullName){
      require("~/" + modelsBaseDir + "/" + modelFullName.split(".")[0]);
    }
  }
  
  private useGlobalPlugins() {
    const globalPluginsBaseDir = "core/global/plugins";
    const globalPluginsName = fs.readdirSync(globalPluginsBaseDir);
    for(const globalPluginName of globalPluginsName){
      const plugin = require("~/" + globalPluginsBaseDir + "/" + globalPluginName.split(".")[0]).default;
      mongoose.plugin(plugin);
    }
  }
}