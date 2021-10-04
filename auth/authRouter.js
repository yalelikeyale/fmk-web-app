'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const authRouter = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


authRouter.use(bodyParser.json());
// The user provides a username and password to login
authRouter.post('/', (req, res, next) => {
  passport.authenticate('local', {session: false}, function(err, user){
    if(err){
      res.status(500).json({code: 500, message: 'Local Auth Error'});
    }
    req.logIn(user, function(err){
      if(err){
        res.status(500).json({code: 500, message: 'req.login error'});
      }
      const authToken = createAuthToken(user.serialize());
      res.json({authToken});
    })
  })
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
authRouter.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {authRouter};