import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from 'config';
import DB from "DB";
import mongoose from "mongoose";
import fs from "fs";

export default class DatabaseServiceProvider extends ServiceProvider {
  async boot() {
    if(!config.get("db.connect"))
      return;
    await DB.connect();
    this.registerModels();
    this.useGlobalPlugins();
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