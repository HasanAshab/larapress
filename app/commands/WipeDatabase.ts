import { Command } from "samer-artisan";
import mongoose from "mongoose";
import DB from "DB";
import DatabaseSeeder from "~/database/seeders/DatabaseSeeder";

export default class WipeDatabase extends Command {
  signature = "db:wipe {--model=}";
  
  async handle() {
    const model = this.option("model");
    await DB.connect();
    if(model) {
      this.info(`Clearing ${model} Model...`)
      const Model = mongoose.model(model);
      await Model.deleteMany({});
    }
    else await DB.reset();
    this.success("Done!");
  }
}
 