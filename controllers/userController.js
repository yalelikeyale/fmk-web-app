'use strict';
const {Users} = require('../models');

const usersController = {
  checkExistingUsers: async (username) => {
    console.log('inside check existing users')
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
    console.log('inside create new user')
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