'use strict';

require('dotenv').config();

const io = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('http');
const express = require('express');
const mongoose = require('mongoose');
const realtime = require('./realtime.js');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const authRouter = require('../route/auth-router.js');
const profileRouter = require('../route/profile-router.js');
const messageRouter = require('../route/message-router.js');
const conversationRouter = require('../route/conversation-router.js');

mongoose.Promise = Promise;

const app = express();

let server = null;
const production = process.env.NODE_ENV === 'production';

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: process.env.CORS_ORIGIN
}

app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(morgan(production ? 'combined' : 'dev'));

app.use(authRouter);
app.use(profileRouter);
app.use(messageRouter);
app.use(conversationRouter);

app.all('*', (req, res) => res.sendStatus(404));

app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (server) {
        return reject(new Error('__SERVER_ERROR__ server is already on'));
      }
      server = realtime(Server(app)).listen(process.env.PORT, () => {
        console.log('__SERVER_ON__', process.env.PORT);
        return resolve();
      });
    })
      .then(() => mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }));
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!server) {
        return reject(new Error('__SERVER_ERROR__ server is already off'));
      }
      server.close(() => {
        server = null;
        console.log('__SERVER_OFF__');
        return resolve();
      });
    })
      .then(() => mongoose.disconnect());
  },
};

