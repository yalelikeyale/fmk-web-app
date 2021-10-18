'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema

const Game = new Schema({
  batch: {type: Array},
  round: {type: Number},
  correct: {type: Boolean}
});

const GameData = mongoose.model('Game', Game);

module.exports = {GameData}