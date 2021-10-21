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
    console.log('made it past check if user exists')
    if(userExists>0){
      console.log('inside user exists if statement')
      throw new Error('User Already Exists')
    }
    console.log('attempting to create new user')
    let userId = await userController.createNewUser(userObj)
    res.status(201).send(userId)
  } catch(error) {
    next(error)
  }
})

module.exports = {usersRouter};