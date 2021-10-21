'use strict';
const {Users} = require('../models');

const usersController = {
  checkExistingUsers: async (username) => {
    try{
      let userExists = await Users.find({username}).count()
      return userExists
    } catch (err) {
      throw err
    }
  },
  createNewUser: async (userObj) => {
    console.log('inside new create new user')
    let {username, firstName, lastName, password} = userObj
    try{
      const usrCreated = await Users.register({username, firstName, lastName, active:true}, password)
      if(usrCreated){
        const heapId = usrCreated.genHeapIdentity()
        console.log(heapId)
        return usrCreated
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = {usersController}