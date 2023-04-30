const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);
const Timestamps = require(base("app/traits/Timestamps"));

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
  for: String,
});

TokenSchema.plugin(Timestamps);

TokenSchema.pre('save', async function(next) {
  if (!this.isModified("token")) {
    return next();
  }
  const hash = await bcrypt.hash(this.token, bcryptRounds);
  this.token = hash;
  next();
});


module.exports = mongoose.model('Token', TokenSchema);