import ServiceProvider from "~/core/providers/ServiceProvider";
import { readdir } from "fs/promises";
import { set as setMongooseConfig, plugin as mongoosePlugin } from "mongoose";
import Config from "Config";
import Helpers from "./plugins/Helpers";
import Assertable from "./plugins/Assertable";
import Paginate from "./plugins/Paginate";
import Transform from "./plugins/Transform";
import Hidden from "./plugins/Hidden";
import DB from "DB";


export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    setMongooseConfig('strictQuery', true);
    this.registerGlobalPlugins();
    this.discoverModels();
  }
  
  async boot() {
    if(Config.get("database.connect") && this.app.runningInWeb()) {
      await DB.connect();
      console.log("Connected to Database!");
    }
  }

  private registerGlobalPlugins() {
    mongoosePlugin(Helpers);
    mongoosePlugin(Assertable);
    mongoosePlugin(Paginate);
    mongoosePlugin(Transform);
    mongoosePlugin(Hidden);
  }
  
  private async discoverModels() {
    const modelFiles = await readdir(base("app/models"));
    const loadPromises = modelFiles.map(name => import("~/app/models/" + name));
    await Promise.all(loadPromises);
  }
}