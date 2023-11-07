import { Command } from "samer-artisan";
import { model } from "mongoose";
import DB from "DB";
import DatabaseSeeder from "~/database/seeders/DatabaseSeeder";
import { HasFactoryModel } from "~/app/plugins/HasFactory";

export default class FactorySeedDatabase extends Command {
  signature = "db:seedFactory {model} {count}";
  /*
  args: {
    model: string;
    count: string;
  }*/
  
  async handle() {
    await DB.connect();
    const { model: modelName, count } = this.arguments();
    const Model = model(modelName as string) as HasFactoryModel;
    await Model.factory().count(parseInt(count as string)).create();
    this.info("Seeded successfully!");
  }
}