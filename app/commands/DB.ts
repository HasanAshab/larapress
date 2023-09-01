import { getModels } from "helpers";
import Command from "~/core/commands/Command";
import mongoose from "mongoose";
import fs from "fs";
import Database from "DB";

export default class DB extends Command {
  async wipe(){
    const { model } = this.params;
    await Database.connect();
    
    if (typeof model === "undefined") {
      this.info("Clearing Database...")
      const models = await getModels();
      const promises = [];
      for (const Model of models){
        promises.push(Model.deleteMany({}));
      }
      await Promise.all(promises);
    }
    else {
      this.info(`Clearing Model ${model}...`)
      const Model = require(`~/app/models/${model}`).default;
      await Model.deleteMany({});
    }
    this.success("Done!");
  }
  
  async seed() {
    this.requiredParams(["model", "count"]);
    await Database.connect();
    const { model, count, ...others} = this.params;
    console.log(model)
    try {
      const Model = require(`~/app/models/${model}`).default;
      this.info("Seeding started...");
      if(typeof Model.factory === "undefined") this.error(`Use "HasFactory" Plugin on ${model} model.`)
      await Model.factory(count).create(others)
      this.success("Seeded successfully!");
    }
    catch (e){
      this.error("Model not found!");
    }
  }
  
  async count() {
    await Database.connect();
    this.info("Counting documents...\n");
    let total = 0;
    const models = await getModels();
    for (const Model of models) {
      const documentCount = await Model.count();
      total += documentCount;
      this.info(`${Model.modelName}:\t${documentCount}`)
    }
    this.success(`Total: ${total}`);
  }
  
}