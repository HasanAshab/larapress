import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from 'config';
import mongoose from "mongoose";
import fs from "fs";
import Core from "~/core/plugins/Core";
import Paginate from "~/core/plugins/Paginate";
import Policy from "~/core/plugins/Policy";

export default class DatabaseServiceProvider extends ServiceProvider {
  async boot() {
    this.useGlobalPlugins();
  }
  
  private useGlobalPlugins() {
    mongoose.plugin(Core);
    mongoose.plugin(Paginate);
    mongoose.plugin(Policy);
  }
}