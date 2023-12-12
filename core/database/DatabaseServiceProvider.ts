import ServiceProvider from "~/core/providers/ServiceProvider";
import { readdir } from "fs/promises";
import { set as setMongooseConfig, syncIndexes, plugin as mongoosePlugin } from "mongoose";
import Config from "Config";
//import Helpers from "./plugins/Helpers";
//import Assertable from "./plugins/Assertable";
//import Paginate from "./plugins/Paginate";
//import Transform from "./plugins/Transform";
//import Hidden from "./plugins/Hidden";
//import Testable from "./plugins/Testable";
import DB from "DB";


export default class DatabaseServiceProvider extends ServiceProvider {
  async register() {
    setMongooseConfig('strictQuery', true);
    this.registerGlobalPlugins();
    await this.discoverModels();
  }
  
  async boot() {
    if(Config.get("database.connect") && this.app.runningInWeb()) {
      await DB.connect();
      console.log("Connected to Database!");
    }
  }

  private registerGlobalPlugins() {
    // mongoosePlugin(Helpers);
//     mongoosePlugin(Assertable);
//     mongoosePlugin(Paginate);
//     mongoosePlugin(Transform);
//     mongoosePlugin(Hidden);
    if(env("NODE_ENV") === "test") {
   //   mongoosePlugin(Testable);
    }
  }
  
  private async discoverModels() {
    const promises = Config.get<string[]>("database.models").map(async dir => {
      const modelFiles = await readdir(base(dir));
      const loadPromises = modelFiles.map(name => import(base(dir, name)));
      await Promise.all(loadPromises);
    });
    
    await Promise.all(promises);
  }
}