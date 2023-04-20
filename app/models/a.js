const mongoose = require('mongoose');
const aSchema = new mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('a', aSchema);