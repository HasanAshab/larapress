import Command from "~/core/abstract/Command";
import mongoose from "mongoose";
import DB from "DB";
import DatabaseSeeder from "~/database/seeders/DatabaseSeeder";

export default class CountDatabase extends Command {
  signature = "db:count {--model=}";
  
  private total = 0;
  
  async handle() {
    await DB.connect();
    const modelsName = mongoose.modelNames();
    this.info("Counting documents...\n");
    const countPromises = modelsName.map(name => this.countModel(name));
    await Promise.all(countPromises);
    this.success(`Total: ${this.total}`);
  }
  
  private async countModel(modelName: string) {
    const Model = mongoose.model(modelName);
    const documentCount = await Model.count();
    this.total += documentCount;
    this.info(`${Model.modelName}:\t${documentCount}`)
  }
}
 