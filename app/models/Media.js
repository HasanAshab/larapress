const mongoose = require('mongoose');
const { unlink } = require('fs');
const Timestamps = require(base("app/traits/Timestamps"));

const MediaSchema = new mongoose.Schema({
  name: String,
  mediableId: mongoose.Schema.Types.ObjectId,
  mediableType: String,
  mimetype: String,
  path: String,
  link: String,
});

MediaSchema.plugin(Timestamps)

MediaSchema.pre(['remove', 'deleteOne', 'findOneAndDelete', 'deleteMany'], function(next) {
  if (process.env.NODE_ENV !== "test") {
    unlink(this.path, () => log(err));
  }
  next();
});


module.exports = mongoose.model('Media', MediaSchema);