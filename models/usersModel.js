'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usersSchema = new mongoose.Schema({
  username:  {type: String, required: true},
  password:  {type: String, required: true},
  first_name: {type: String, required: true}
});

usersSchema.methods.serialize = function() {
  return {
    username: this.username,
    first_name:this.first_name
  };
}

usersSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

usersSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const Users = mongoose.model('users', usersSchema);

module.exports = {Users};