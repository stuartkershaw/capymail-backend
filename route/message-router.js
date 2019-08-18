'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const Message = require('../model/message.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const mailgun_api = process.env.MAILGUN_API_KEY; 
const mailgun_domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: mailgun_api, domain: mailgun_domain });

const messageRouter = module.exports = new Router();

messageRouter.get('/messages', bearerAuth, (req, res, next) => {
  console.log(req.query);
  Message.find({ conversation: req.query._id })
    .then(messages => {
      if (!messages) {
        throw httpErrors(404, '__REQUEST_ERROR__ messages not found');
      }
      res.json(messages);
    })
    .catch(next);
});

messageRouter.post('/messages', bearerAuth, (req, res, next) => {
  console.log(req.body.message);
  if (!req.body.message.content ||! req.body.message.recipientEmail || 
      !req.body.message.senderEmail || !req.body.message.senderFirstName || 
      !req.body.message.senderLastName || !req.body.conversation) {
    return next(httpErrors(400, '__REQUEST_ERROR__ content, recipient, sender, and conversation details required'));
  }
  return new Message({
    // jshint ignore:start
    ...req.body.message,
    // jshint ignore:end
    conversation: req.body.conversation._id,
  }).save()
    .then(message => {
      res.json(message);
    })
    .catch(next);
});

messageRouter.post('/webhooks/mailgun/*', (req, res, next) => {
  const body = req.body;
  if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
    console.error('Request came, but not from Mailgun');
    res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
    return;
  }
  next();
});

messageRouter.post('/webhooks/mailgun/catchall', (req, res, next) => {
  const found;
  const body = req.body;
  Message.findOne({ emailId: body['In-Reply-To'] })
  .then(message => {
    if (!message) {
      throw httpErrors(404, '__REQUEST_ERROR__ message not found');
    }
    found = message;
  })
  .then(() => {
    return new Message({
      emailId: body['Message-Id'],
      subject: body.subject,
      content: body['body-html'],
      senderEmail: body.sender,
      senderFirstName: body.from.split(' ')[0],
      senderLastName: body.from.split(' ')[1],
      recipientEmail: body.recipient,
      conversation: found.conversation,
    }).save()
    .then(message => {
      res.json(message);
    });
  })
  .catch(next);
});

