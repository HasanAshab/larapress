import { base } from "helpers";
import Command from "illuminate/commands/Command";
import mongoose from "mongoose";
import fs from "fs";
import DB from "illuminate/utils/DB";
import { clearDatabase } from "illuminate/utils";

export default class DB extends Command {
  async wipe(){
    const { model } = this.params;
    this.info("Connecting to database...");
    await DB.connect();
    if (typeof model === "undefined") this.info("Clearing Database...")
    else this.info(`Clearing Model ${model}...`)
    await clearDatabase(model);
    this.success("Done!");
  }
  
  
  async seed() {
    this.requiredParams(["model", "count"]);
    this.info("Connecting to database...");
    await DB.connect();
    const {
      count
    } = this.params;
    try {
      const Model = require(base(`app/models/${this.params.model}`)).default;
      this.info("Seeding started...");
      await Model.factory(count).create()
      this.success("Seeded successfully!");
    }
    catch {
      this.error("Model not found!");
    }
  }
  
  async count() {
    await DB.connect();
    this.info("Counting documents...\n");
    let total = 0;
    const modelNames = fs.readdirSync(base("app/models"));
    for (const modelName of modelNames) {
      const Model = require(base(`app/models/${modelName}`)).default;
      const documentCount = await Model.count();
      total += documentCount;
      this.info(`${modelName}:\t${documentCount}`)
    }
    this.success(`Total: ${total}`);
  }
  
}