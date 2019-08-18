'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = new Router();

profileRouter.get('/profile', bearerAuth, (req, res, next) => {
  Profile.findOne({ account: req.account._id })
    .then(profile => {
      if (!profile) {
        throw httpErrors(404, '__REQUEST_ERROR__ profile not found');
      }

      res.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', bearerAuth, (req, res, next) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        throw httpErrors(404, '__REQUEST_ERROR__ profile not found');
      }

      res.json(profile);
    })
    .catch(next);
});

profileRouter.post('/profiles', bearerAuth, (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    return next(httpErrors(400, '__REQUEST_ERROR__ first name and last name required'));
  }

  return new Profile({
    // jshint ignore:start
    ...req.body,
    // jshint ignore:end
    username: req.account.username,
    email: req.account.email,
    account: req.account._id,
  }).save()
    .then(profile => {
      res.json(profile);
    })
    .catch(next);
});

profileRouter.put('/profiles/:id', bearerAuth, (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    return next(httpErrors(400, 'first name and last name required'));
  }

  Profile.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    .then(profile => {
      if (!profile) {
        throw httpErrors(404, '__REQUEST_ERROR__ profile not found');
      }

      res.json(profile);
    })
    .catch(next);
});

