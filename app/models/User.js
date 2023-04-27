const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const VerificationMail = require(base("app/mails/VerificationMail"));
const Token = require(base("app/models/Token"));
const HasFactory = require(base("app/traits/HasFactory"));
const HasApiTokens = require(base("app/traits/HasApiTokens"));
const Notifiable = require(base("app/traits/Notifiable"));
const Mediable = require(base("app/traits/Mediable"));
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 12,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  logoUrl: {
    type: String,
    default: url('/static/user-profile.jpg'),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);

UserSchema.methods.sendVerificationEmail = async function () {
  if (this.emailVerified) {
    return false;
  }
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const token = await Token.create({
    userId: this._id,
    token: verificationToken,
    for: "email_verification",
  });
  const link = url(`/api/auth/verify?id=${this._id}&token=${verificationToken}`);
  return this.notify(new VerificationMail({ link }));
};


UserSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", UserSchema);
