const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  },
  password: {
    type: String,
    required: true,
  },
  is_admin:{
    type: Boolean,
    required: true,
    default: false
  },
  email_verified:{
    type: Boolean,
    required: true,
    default: false
  },
  created_at:{
    type: Date,
    required: true,
    default: new Date()
  },
});

module.exports = mongoose.model('User', UserSchema);