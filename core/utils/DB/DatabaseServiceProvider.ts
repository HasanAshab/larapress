import ServiceProvider from "~/core/providers/ServiceProvider";
import fs from "fs";
import mongoose from "mongoose";
import Helpers from "./plugins/Helpers";
import Assertable from "./plugins/Assertable";
import Paginate from "./plugins/Paginate";
import Transform from "./plugins/Transform";
import Hidden from "./plugins/Hidden";


export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    mongoose.set('strictQuery', true);
    this.registerGlobalPlugins();
    this.discoverModels();
  }
  
  private registerGlobalPlugins() {
    mongoose.plugin(Helpers);
    mongoose.plugin(Assertable);
    mongoose.plugin(Paginate);
    mongoose.plugin(Transform);
    mongoose.plugin(Hidden);
  }
  
  private discoverModels() {
    fs.readdirSync(base("app/models")).forEach(model => {
      require("~/app/models/" + model)
    });
  }
}