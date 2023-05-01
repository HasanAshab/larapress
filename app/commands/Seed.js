const Command = require(base('illuminate/commands/Command'));
const mongoose = require('mongoose');
const DB = require(base("illuminate/utils/DB"));

class Seed extends Command {
  handle = async () => {
    this.requiredParams(['model', 'count']);
    await DB.connect();
    const { model, count } = this.params;
    try{
      const Model = require(base(`app/models/${model}`));
      this.alert('Seeding started...');
      await Model.factory(count).create()
      this.success('Seeded successfully!');
    }
    catch{
      this.error('Model not found!');
    }
  }
  
}


module.exports = Seed;