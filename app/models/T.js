const mongoose = require('mongoose');
const HasFactory = require(base("app/traits/HasFactory"));

const TSchema = new mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now(),
  },
});

TSchema.plugin(HasFactory);

module.exports = mongoose.model('T', TSchema);