const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Authenticatable = require(base("app/traits/Authenticatable"));
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(Authenticatable);
UserSchema.plugin(HasFactory);
UserSchema.plugin(HasApiTokens);
UserSchema.plugin(Notifiable);
UserSchema.plugin(Mediable);



UserSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, bcryptRounds);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", UserSchema);
