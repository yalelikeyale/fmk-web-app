'use strict';
const {Users} = require('../models');

const usersController = {
  checkRequiredFields: (userObj) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in userObj));
    if (missingField) {
        console.log('inside if statement so need to throw error differently')
        let err = new Error('Missing required field')
        err.status = 422
        err.location = 'usersController'
        throw err
    }
  },
  checkExistingUsers: async (username) => {
    try{
      const usrExists = await Users.find({username})
      if(usrExists){
        let error = new Error('User Already Exists')
        throw error
      }
      return Promise.resolve()
    } catch (err) {
      throw err
    }
  },
  createNewUser: async (userObj) => {
    let {username, firstName, lastName, password} = userObj
    try{
      const usrCreated = await Users.register({username, firstName, lastName, active:true}, password)
      if(usrCreated){
        return usrCreated.genHeapIdentity()
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = {usersController}