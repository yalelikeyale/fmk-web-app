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
        console.log('inside if statement so need to throw error differently')
        let err = new Error('Missing required field')
        err.status = 422
        err.location = 'usersController'
        throw err
    }
    let userExists = await userController.checkExistingUsers(userObj.username)
    if(userExists){
      throw new Error('User Already Exists')
    }
    let userId = await userController.createNewUser(userObj)
    res.status(201).send(userId)
  } catch(error) {
    next(error)
  }
})

module.exports = {usersRouter};