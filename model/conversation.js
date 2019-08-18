'use strict';

const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  title: { type: String },
  profile: { type: mongoose.Schema.Types.ObjectId },
  created: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('conversation', conversationSchema);

