'use strict';
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema

const Users = new Schema({
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

Users.methods.genHeapIdentity = function() {
  return {
    heapIdentity: this._id
  };
};

Users.plugin(passportLocalMongoose)
const Users = mongoose.model('User', UserSchema);

module.exports = mongoose.model('userData', Users, 'userData');

