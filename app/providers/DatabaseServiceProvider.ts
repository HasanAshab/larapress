import ServiceProvider from "~/core/abstract/ServiceProvider";
import mongoose from "mongoose";
import Core from "~/core/plugins/Core";
import Paginate from "~/core/plugins/Paginate";
import Policy from "~/core/plugins/Policy";

export default class DatabaseServiceProvider extends ServiceProvider {
  register() {
    mongoose.plugin(Core);
    mongoose.plugin(Paginate);
    mongoose.plugin(Policy);
  }
}