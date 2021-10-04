'use strict';
const express = require('express');
const config = require('dotenv').config()
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const signinRouter = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

signinRouter.use(bodyParser.json());
// The user provides a username and password to login
signinRouter.post('/', localAuth, (err, _user) => {
  console.log(_user)
  const authToken = createAuthToken(_user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
signinRouter.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {signinRouter};