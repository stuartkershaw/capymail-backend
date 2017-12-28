'use strict';

const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  title: {type: String},
  created: {type: Date, default: () => new Date()},
  profile: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('conversation', conversationSchema);
