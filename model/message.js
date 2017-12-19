'use strict';

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  subject: {type: String},
  content: {type: String, required: true},
  recipientEmail: {type: String, required: true},
  senderEmail: {type: String, required: true},
  senderFirstName: {type: String, required: true},
  senderLastName: {type: String, required: true},
  created: {type: Date, default: () => new Date()},
  emailId: {type: String},
  profile: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('message', messageSchema);
