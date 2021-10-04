'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const config = require('dotenv').config()
// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { Users } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET



const localStrategy = new LocalStrategy({
  usernameField:'username', 
  passwordField:'password', 
  passReqToCallback: true
}, (req, username, password, done) => {
  let user;
  Users.findOne({ username })
    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      req.login(user, function(err){
        if(err){return err}
        return done(null, user)
      })
    })
    .catch(err => {
      return(done(err))
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };

