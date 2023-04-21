const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  token: String,
  for: String,
  created_at: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});

TokenSchema.pre('save', async function(next) {
  if (!this.isModified("token")) {
    return next();
  }
  const hash = await bcrypt.hash(this.token, bcryptRounds);
  this.token = hash;
  next();
});


module.exports = mongoose.model('Token', TokenSchema);