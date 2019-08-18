'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  username: { type: String },
  account: { type: mongoose.Schema.Types.ObjectId },
  created: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('profile', profileSchema);

