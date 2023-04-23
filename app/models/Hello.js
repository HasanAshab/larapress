const mongoose = require('mongoose');

const HelloSchema = new mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Hello', HelloSchema);