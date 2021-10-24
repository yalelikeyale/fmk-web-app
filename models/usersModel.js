'use strict';
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema

const User = new Schema({
  username: {type: String, required: true, unique: true},
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  active:{type: Boolean, default: false}
});

User.methods.genHeapIdentity = function() {
  return {
    heapIdentity: this._id.str
  };
};

User.plugin(passportLocalMongoose)
const Users = mongoose.model('User', User);

module.exports = {Users}

