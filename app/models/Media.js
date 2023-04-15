const mongoose = require('mongoose');
const MediaSchema = new mongoose.Schema({
  name: String,
  mediableId: mongoose.Schema.Types.ObjectId,
  mediableType: String,
  mimetype: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

MediaSchema.virtual('link').get(function() {
  return url('');
});

module.exports = mongoose.model('Media', MediaSchema);