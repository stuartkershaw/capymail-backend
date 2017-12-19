'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String},
  username: {type: String},
  created: {type: Date, default: () => new Date()},
  account: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('profile', profileSchema);
