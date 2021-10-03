'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Users} = require('../models');

const userRouter = express.Router();
const jsonParser = bodyParser.json();

//to access with jwtauth, you need to pass a users jwt token with the header Authorization + value of Bearer {jwttoken}
const jwtAuth = passport.authenticate('jwt', { session: false });

userRouter.use(jsonParser);

// Post to register a new user
userRouter.post('/', jwtAuth, (req, res) => {
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

//put to update a user ie. change password/ permissions
userRouter.put('/:username', jwtAuth, (req,res)=>{
  let username = req.params.username;
  if(!(username && username.length > 6)){
    res.status(400).send('Please Enter a Valid username');
  }
  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  const updateableFields = ['username', 'first_name'];
  const updated = {};
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  return Users.find({username})
      .count()
      .then(count => {
        if(!(count===1)){
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'username not Found',
            location: 'username'
          });
        }
        return null
      })
      .then(()=>{
        Users.findOneAndUpdate({username},{ $set: updated }, { new: true })
        .then(updatedUser => {res.status(201).json(updatedUser.serialize())})
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
      })
      .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

userRouter.delete('/:username',  jwtAuth, (req,res)=>{
  let username = req.params.username 
  if(!(username && username.length>6)){
    res.status(400).send('Please Enter a Valid username');
  }
  Users.find({username})
      .count()
      .then(count => {
        if(!(count===1)){
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'username not Found',
            location: 'username'
          });
        }
        return null
      })
      .then(()=>{
        Users.find({username})
          .remove()
          .then(()=>{
            res.status(201).send('User Deleted');
          });
      })
});

userRouter.get('/', jwtAuth, (req, res) => {
  return Users.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = {userRouter};