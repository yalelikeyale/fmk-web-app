'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Image = new Schema({
  _id:false,
  img_file: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  img_key:{
    type: String,
    index: true,
    unique: true,
    required: true
  }
});

Image.methods.genCardData = function() {
  return {
    alt: this.alt,
    img_file: this.img_name,
    answer: this.answer,
    img_key: this.img_key
  };
};
  
const Images = mongoose.model('Image', Image);
  
module.exports = {Images}