'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const usersRouter = express.Router();

const {userController} = require('../controllers')


// Post to register a new user
usersRouter.post('/', jsonParser, (req, res) => {
  let {username, password, firstName = '', lastName = ''} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  const userObj = {username, password, firstName, lastName}
  async function checkUserRequest(userObj){
    try{
      await userController.checkRequiredFields(userObj)
      await userController.checkStringFields(userObj)
      await userController.checkTrimmedFields(userObj)
      await userController.checkFieldSize(userObj)
      await userController.checkExistingUsers(userObj.username)
      let userId = await userController.createNewUser(userObj)
      if(userId){
        return res.status(201).json(userId);
      } else {
        let err = new Error('No User ID returned')
        err.status = 500
        err.location = 'Users Router'
        throw err
      }
    } catch(error) {
      return Promise.reject({
        code: error.status,
        message: error.message,
        location: error.location
      });
    }
  }
  checkUserRequest(userObj)
})

module.exports = {usersRouter};