import { getModels } from "helpers";
import Command from "~/core/abstract/Command";
import mongoose from "mongoose";
import fs from "fs";
import Database from "DB";
import DatabaseSeeder from "~/database/seeders/DatabaseSeeder";
import Setup from "~/main/Setup";

export default class DB extends Command {
  async wipe(){
    const { model } = this.params;
    await Database.connect();
    Setup.mongooseModels();
    if(model) {
      this.info(`Clearing Model ${model}...`)
      const Model = mongoose.model(model);
      await Model.deleteMany({});
    }
    else await Database.reset();
    this.success("Done!");
  }

  async count() {
    await Database.connect();
    const modelsName = Setup.mongooseModels();
    this.info("Counting documents...\n");
    const countPromises: any = [];
    this.total = 0;
    for (const name of modelsName) {
      countPromises.push(this.countSingeModel(name));
    }
    await Promise.all(countPromises);
    this.success(`Total: ${this.total}`);
  }
  
  async seed() {
    let seeder;
    if(this.params.seeder){
      const { default: Seeder } = await import("~/database/seeders/" + this.params.seeder);
      seeder = new Seeder();
    }
    else seeder = new DatabaseSeeder();
    await Database.connect();
    await seeder.run();
    this.success("Seeded successfully!");
  }
  
  private async countSingeModel(modelName: string) {
    const Model = mongoose.model(modelName);
    const documentCount = await Model.count();
    this.total += documentCount;
    this.info(`${Model.modelName}:\t${documentCount}`)
  }
}