const Command = require(base('illuminate/commands/Command'));
const mongoose = require('mongoose');
const DB = require(base("illuminate/utils/DB"));

class Seed extends Command {
  handle = async () => {
    await DB.connect()
    this.requiredFlags(['count']);
    try{
      const Model = require(base(`app/models/${this.subCommand}`));
      this.alert('Seeding started...');
      await Model.factory(this.flags.count).create()
      this.success('Seeded successfully!');
    }
    catch{
      this.error('Model not found!');
    }
  }
  
}


module.exports = Seed;