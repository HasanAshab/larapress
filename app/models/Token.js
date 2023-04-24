const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: String,
  for: String,
  createdAt: {
    type: Date,
    default: Date.now()
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