'use strict';

const io = require('socket.io');
const httpErrors = require('http-errors');
const Message = require('../model/message.js');
const mailgun_api = process.env.MAILGUN_API_KEY; 
const mailgun_domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgun_api, domain: mailgun_domain});

module.exports = (server) => {
  const chatroom = io(server).on('connection', (socket) => {
    socket.on('MESSAGE_CREATE', (message) =>  {
      let data = {
        to: `${message.recipientEmail}, ${message.senderEmail}`,
        from: `${message.senderFirstName} ${message.senderLastName} <postmaster@${mailgun_domain}>`,
        subject: `${message.subject}`,
        html: `${message.content}`
      };
      mailgun.messages().send(data, function (error, body) {
        Message.findOne({_id: message.messageId}, function (err, message) {
          message.emailId = body.id;
          message.save(function (err) {
            if (err) {
              throw httpErrors(404, '__REQUEST_ERROR__ message not found');  
            }
          });
        });
      });
    });
  })
  .on('error', error => {
    console.error('REALTIME_ERROR', error);
  });
  return server;
};
