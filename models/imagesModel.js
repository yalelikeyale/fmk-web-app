'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Image = new Schema({
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
  batch_key:{
    type: String, 
    required: true
  }
});

Image.methods.genCardData = function() {
  return {
    img_id: this._id,
    alt: this.alt,
    img_file: this.img_file,
    answer: this.answer
  };
};
  
const Images = mongoose.model('Image', Image);
  
module.exports = {Images}