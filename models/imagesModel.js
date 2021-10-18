'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Image = new Schema({
  img: {type: String},
  alt: {type: String},
  answer: {type: String},
  img_name: {type: String},
  img_number:{type: Number}
});
  
const Images = mongoose.model('Image', Image);
  
module.exports = {Images}