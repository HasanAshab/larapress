const mongoose = require('mongoose');
const MediaSchema = new mongoose.Schema({
  name: String,
  mediableId: mongoose.Schema.Types.ObjectId,
  mediableType: String,
  mimetype: String,
  path: String,
  link: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Media', MediaSchema);