'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Users} = require('../models');

const usersRouter = express.Router();
const jsonParser = bodyParser.json();

usersRouter.use(jsonParser);

// Post to register a new user
usersRouter.post('/', (req, res) => {
  const requiredFields = ['username', 'password', 'first_name'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    res.status(422).json({
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const explicityTrimmedFields = ['username', 'password','first_name'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    res.status(422).json({
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 6
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    res.status(422).json({
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, first_name} = req.body;

  return Users.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        const error = {
          code: 422,
          reason: 'ValidationError',
          message: 'User Already Exists'
        }
        Promise.reject(error);
      }
      return Users.hashPassword(password);
    })
    .then((hash) => {
      return Users.create({
        first_name,
        username,
        password: hash
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
})

module.exports = {usersRouter};