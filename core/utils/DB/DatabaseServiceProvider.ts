import ServiceProvider from "~/core/abstract/ServiceProvider";
import fs from "fs";
import mongoose from "mongoose";
import Core from "./plugins/Core";
import Helpers from "./plugins/Helpers";
import Assertable from "./plugins/Assertable";
import Hidden from "./plugins/Hidden";
import Paginate from "./plugins/Paginate";


export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    mongoose.set('strictQuery', true);
    this.registerGlobalPlugins();
    this.discoverModels();
  }
  
  private registerGlobalPlugins() {
    mongoose.plugin(Core);
    mongoose.plugin(Helpers);
    mongoose.plugin(Assertable);
    mongoose.plugin(Hidden);
    mongoose.plugin(Paginate);
  }
  
  private discoverModels() {
    fs.readdirSync(base("app/models")).forEach(model => {
      require("~/app/models/" + model)
    });
  }
}