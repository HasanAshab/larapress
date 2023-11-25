import ServiceProvider from "~/core/abstract/ServiceProvider";
import fs from "fs";
import mongoose from "mongoose";
import Core from "./plugins/Core";
import Hidden from "./plugins/Hidden";
import Paginate from "./plugins/Paginate";
import Policy from "./plugins/Policy";


export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    mongoose.set('strictQuery', true);
    this.registerGlobalPlugins();
    this.discoverModels();
  }
  
  private registerGlobalPlugins() {
    mongoose.plugin(Core);
    mongoose.plugin(Hidden);
    mongoose.plugin(Paginate);
    mongoose.plugin(Policy);
  }
  
  private discoverModels() {
    fs.readdirSync(base("app/models")).forEach(model => {
      require("~/app/models/" + model)
    });
  }
}