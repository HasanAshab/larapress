import { base, getModels } from "helpers";
import Command from "illuminate/commands/Command";
import mongoose from "mongoose";
import fs from "fs";
import Database from "illuminate/utils/DB";

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
      const Model = require(base(`app/models/${model}`)).default;
      await Model.deleteMany({});
    }
    this.success("Done!");
  }
  
  
  async seed() {
    this.requiredParams(["model", "count"]);
    await Database.connect();
    const {
      count
    } = this.params;
    try {
      const Model = require(base(`app/models/${this.params.model}`)).default;
      this.info("Seeding started...");
      if(typeof Model.factory === "undefined") this.error(`No factory found for ${this.params.model} model`)
      await Model.factory(count).create()
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