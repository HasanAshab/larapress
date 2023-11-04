import { Command } from "samer-artisan";
import mongoose from "mongoose";
import DB from "DB";
import DatabaseSeeder from "~/database/seeders/DatabaseSeeder";

export default class FactorySeedDatabase extends Command {
  signature = "db:seedFactory {model} {count}";
  
  async handle() {
    await DB.connect();
    const { model, count } = this.arguments();
    const Model = mongoose.model(model);
    await Model.factory().count(count).create()
    this.success("Seeded successfully!");
  }
}
 