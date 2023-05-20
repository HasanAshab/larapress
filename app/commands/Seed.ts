import { base } from "helpers";
import Command from 'illuminate/commands/Command';
import mongoose from 'mongoose';
import DB from "illuminate/utils/DB";

export default class Seed extends Command {
  async handle(){
    this.subCommandRequired("Model name");
    this.requiredParams(['count']);
    this.info('Connecting to database...');
    await DB.connect();
    const { count } = this.params;
    try{
      const Model = require(base(`app/models/${this.subCommand}`)).default;
      this.info('Seeding started...');
      await Model.factory(count).create()
      this.success('Seeded successfully!');
    }
    catch (e) {
      console.log(e)
      this.error('Model not found!');
    }
  }
}