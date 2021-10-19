'use strict';
const {Users} = require('../models');

const usersController = {
    checkRequiredFields: (userObj) => {
        const requiredFields = ['username', 'password'];
        const missingField = requiredFields.find(field => !(field in userObj));
      
        if (missingField) {
            // reject to trigger catch
            let err = new Error('Missing required field')
            err.status = 422
            err.location = 'usersController'
        }
        return resolve()
    },
    checkStringFields: (userObj) => {
        const stringFields = ['username', 'password', 'firstName', 'lastName'];
        const nonStringField = stringFields.find(
          field => field in userObj && typeof userObj[field] !== 'string'
        );
      
        if (nonStringField) {
          // reject to trigger catch
          let err = new Error('Field must be a string')
          err.status = 422
          err.location = 'checkStringFields'
          throw err
        }
        return resolve()
    }, 
    checkTrimmedFields: (userObj) => {
        const explicityTrimmedFields = ['username', 'password'];
        const nonTrimmedField = explicityTrimmedFields.find(
          field => req.body[field].trim() !== req.body[field]
        );
      
        if (nonTrimmedField) {
            let err = new Error('Cannot begin or end field with empty space')
            err.status = 422
            err.location = 'checkTrimmedFields'
            throw err
        }
        return resolve()
    },
    checkFieldSize: (userObj) => {
        const sizedFields = {
            username: {
              min: 1
            },
            password: {
              min: 6,
              max: 72
            }
          };
        const tooSmallField = Object.keys(sizedFields).find(
            field =>
              'min' in sizedFields[field] &&
                    userObj[field].trim().length < sizedFields[field].min
          );
          const tooLargeField = Object.keys(sizedFields).find(
            field =>
              'max' in sizedFields[field] &&
                    userObj[field].trim().length > sizedFields[field].max
          );
          if (tooSmallField || tooLargeField) {
              // reject promise
              let err = new Error('Credentials too small or too large')
              err.status = 422
              err.location = 'checkFieldSize'
              throw err
          }
          return resolve()
    }, 
    checkExistingUsers: (username) => {
        Users.find({username})
        .count()
        .then(count => {
            if (count > 0) {
              // There is an existing user with the same username
              let err = new Error('User already Exists')
              err.status = 422
              err.location = 'checkExistingUsers'
              throw err
            }
            return resolve()
        })
        .catch(err => {
            err.status = 500
            err.location = 'checkExistingUsers'
            throw err
        })
    },
    createNewUser: (userObj) => {
        let {username, firstName, lastName, password} = userObj
        Users.register({username, firstName, lastName, active:true}, password)
        .then(user=>{
          if(!user){
            throw new Error('No user returned')
          }
          const userId = user.genHeapIdentity()
          return resolve(userId)
        })
        .catch(err => {
          err.status = 500
          err.location = 'createNewUser'
          throw err
        })
    }
}

module.exports = {usersController}