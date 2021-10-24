'use strict';
const {Users} = require('../models');

const userController = {
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
      const newUser = await Users.register({username, firstName, lastName, active:true}, password)
      if(newUser){
        return newUser.genUsrObj
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = {userController}