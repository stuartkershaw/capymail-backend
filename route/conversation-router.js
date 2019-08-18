'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const Conversation = require('../model/conversation.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const conversationRouter = module.exports = new Router();

conversationRouter.get('/conversations', bearerAuth, (req, res, next) => {
  Conversation.find({ profile: req.query._id })
    .then(conversations => {
      if (!conversations) {
        throw httpErrors(404, '__REQUEST_ERROR__ conversations not found');
      }

      res.json(conversations);
    })
    .catch(next);
});

conversationRouter.get('/conversations/:id', bearerAuth, (req, res, next) => {
  Conversation.findById(req.params.id)
    .then(conversation => {
      if (!conversation) {
        throw httpErrors(404, '__REQUEST_ERROR__ conversation not found');
      }

      res.json(conversation);
    })
    .catch(next);
});

conversationRouter.post('/conversations', bearerAuth, (req, res, next) => {
  if (!req.body.title) {
    return next(httpErrors(400, '__REQUEST_ERROR__ title required'));
  }

  return new Conversation({
    // jshint ignore:start
    ...req.body,
    // jshint ignore:end
    profile: req.body.profile._id,
  }).save()
    .then(conversation => {
      res.json(conversation);
    })
    .catch(next);
});

