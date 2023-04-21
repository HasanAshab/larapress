const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const VerificationMail = mail("VerificationMail");
const Token = model("Token");
const Authenticatable = trait("Authenticatable");
const Notifiable = trait("Notifiable");
const Mediable = trait("Mediable");
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  tokenVersion: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);

schema.methods.sendVerificationEmail = async function () {
  if (this.emailVerified) {
    return Promise.reject("Account already verified");
  }
  await Token.deleteMany({
    userId: this._id,
    for: "email_verification",
  });
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, bcryptRounds);
  const token = await Token.create({
    userId: this._id,
    token: hash,
    for: "email_verification",
  });
  const link = url(`/api/auth/verify?id=${this._id}&token=${resetToken}`);
  return this.notify(new VerificationMail({ link }));
};

module.exports = mongoose.model("User", UserSchema);
