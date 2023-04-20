const mongoose = require('mongoose');
const { unlink } = require('fs');

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

MediaSchema.pre(['remove', 'deleteOne', 'findOneAndDelete', 'deleteMany'], function(next) {
  console.log('djdj')
  unlink(this.path, (err) => log(err));
  next();
});


module.exports = mongoose.model('Media', MediaSchema);