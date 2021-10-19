'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Image = new Schema({
  img_path: {type: String},
  alt: {type: String},
  answer: {type: String},
  image_key: {type: String}
});

User.methods.genCardData = function() {
  return {
    alt: this.alt,
    img_path: this.imgage_path,
    answer: this.answer,
    image_key: this.image_key
  };
};
  
const Images = mongoose.model('Image', Image);
  
module.exports = {Images}