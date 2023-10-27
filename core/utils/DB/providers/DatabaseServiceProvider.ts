import ServiceProvider from "~/core/abstract/ServiceProvider";
import mongoose from "mongoose";
import fs from "fs";
import Core from "~/core/plugins/Core";
import Paginate from "~/core/plugins/Paginate";
import Policy from "~/core/plugins/Policy";

export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    mongoose.plugin(Core);
    mongoose.plugin(Paginate);
    mongoose.plugin(Policy);
    this.discoverModels();
  }
  
  private discoverModels() {
    fs.readdirSync(base("app/models")).forEach(model => {
      require("~/app/models/" + model)
    });
  }
}