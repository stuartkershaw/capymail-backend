'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const Message = require('../model/message.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const mailgun_api = process.env.MAILGUN_API_KEY; 
const mailgun_domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgun_api, domain: mailgun_domain});

const messageRouter = module.exports = new Router();

messageRouter.get('/messages', bearerAuth, (req, res, next) => {
  Message.find({profile: req.query._id})
    .then(messages => {
      if (!messages) {
        throw httpErrors(404, '__REQUEST_ERROR__ messages not found');
      }
      res.json(messages);
    })
    .catch(next);
});

messageRouter.post('/messages', bearerAuth, (req, res, next) => {
  if (!req.body.content ||! req.body.recipientEmail || 
      !req.body.clientProfile.email || !req.body.clientProfile.firstName || 
      !req.body.clientProfile.lastName) {
    return next(httpErrors(400, '__REQUEST_ERROR__ content, recipient, and sender details required'));
  }
  return new Message({
    // jshint ignore:start
    ...req.body,
    // jshint ignore:end
    senderEmail: req.body.clientProfile.email,
    senderFirstName: req.body.clientProfile.firstName,
    senderLastName: req.body.clientProfile.lastName,
    profile: req.body.clientProfile._id,
  }).save()
    .then(message => {
      res.json(message);
    })
    .catch(next);
});

messageRouter.post('/webhooks/mailgun/*', (req, res, next) => {
  let body = req.body;
  if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
    console.error('Request came, but not from Mailgun');
    res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
    return;
  }
  next();
});

messageRouter.post('/webhooks/mailgun/catchall', (req, res, next) => {
  let found;
  let body = req.body;
  Message.findOne({emailId: body['In-Reply-To']})
  .then(message => {
    if (!message) {
      throw httpErrors(404, '__REQUEST_ERROR__ message not found');
    }
    found = message;
  })
  .then(() => {
    return new Message({
      subject: body.subject,
      content: body['body-html'],
      recipientEmail: body.recipient,
      senderEmail: body.sender,
      senderFirstName: body.from.split(' ')[0],
      senderLastName: body.from.split(' ')[1],
      emailId: body['Message-Id'],
      profile: found.profile,
    }).save()
    .then(message => {
      res.json(message);
    });
  })
  .catch(next);
});
