'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Image = new Schema({
  img_name: {type: String},
  alt: {type: String},
  answer: {type: String}
});

Image.methods.genCardData = function() {
  return {
    alt: this.alt,
    img_name: this.img_name,
    answer: this.answer
  };
};
  
const Images = mongoose.model('Image', Image);
  
module.exports = {Images}