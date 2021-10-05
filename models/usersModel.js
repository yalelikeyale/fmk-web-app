'use strict';
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  active:{type: Boolean}
});

User.methods.genHeapIdentity = function() {
  return {
    heapIdentity: this._id
  };
};

User.plugin(passportLocalMongoose)
const Users = mongoose.model('User', User);

module.exports = {Users}

