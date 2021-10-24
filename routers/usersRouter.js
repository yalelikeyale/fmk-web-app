'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const usersRouter = express.Router();

const {userController} = require('../controllers')


// Post to register a new user
usersRouter.post('/', jsonParser, async (req, res, next) => {
  try{
    let {username, password, firstName = '', lastName = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    const userObj = {username, password, firstName, lastName}
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in userObj));
    if (missingField) {
        let err = new Error('Missing required field')
        err.status = 422
        err.location = 'usersController'
        throw err
    }
    let userExists = await userController.checkExistingUsers(userObj.username)
    if(userExists>0){
      throw new Error('User Already Exists')
    }
    let newUser = await userController.createNewUser(userObj)
    if(newUser){
      res.status(201).json(newUser)
    } else {
      throw new Error('No User Object to Return')
    }
  } catch(error) {
    next(error)
  }
})

module.exports = {usersRouter};