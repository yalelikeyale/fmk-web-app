'use strict';
const {Users} = require('../models');

const usersController = {
  checkExistingUsers: async (username) => {
    try{
      let userExists = await Users.find({username})
      return userExists
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