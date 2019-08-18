'use strict';

const { Router } = require('express');
const superagent = require('superagent');
const httpErrors = require('http-errors');
const Account = require('../model/account.js');
const Profile = require('../model/profile.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const authRouter = module.exports = new Router();

authRouter.get('/auth', basicAuth, (req, res, next) => {
  req.account.tokenCreate()
    .then(token => {
      res.cookie('X-CapyMail-Token', token, { maxAge: 604800000 });
      res.json({ token });
    })
    .catch(next);
});

authRouter.post('/auth', (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password required'));
  }
  Account.create(req.body)
    .then(account => account.tokenCreate())
    .then(token => {
      res.cookie('X-CapyMail-Token', token, { maxAge: 604800000 });
      res.json({ token });
    })
    .catch(next);
});

authRouter.put('/auth', basicAuth, (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password required'));
  }
  req.account.update(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(next);
});

