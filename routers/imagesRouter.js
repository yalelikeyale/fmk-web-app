'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { imageController } = require('../controllers');
const imagesRouter = express.Router();

const { awsUpload } = require('../middleware');

imagesRouter.post('/', awsUpload.single('img_file_name'), async (req, res) => {
  try{
    const img_name = req.file.originalname
    const {alt, answer} = req.body
    const imgObj = {
      img_name, 
      alt, 
      answer
    }
    const dbImg = await imageController.mongoStoreCardData(imgObj)
    if(dbImg){
      res.status(201).json(dbImg)
    } else {
      let error = new Error('no dbImg to return')
      error.status = 500 
      error.location = 'else statement of images post router '
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject({
      code: error.status,
      message: error.message,
      location: error.location
    });
  }
})

imagesRouter.get('/:imagekey', jsonParser, (req, res) => {
  const imgKey = req.params.image_key
  async function fetchImageData(key){
    try{
      const imgData = await imageController.mongoFetchCardData(imgKey)
        if(imgData){
          res.status(201).json(imgData);
        } else {
          let error = new Error('no dbImg to return')
          error.status = 500 
          error.location = 'else statement of images post router '
          return Promise.reject(error);
        }
      } catch(error) {
        return Promise.reject({
          code: error.status,
          message: error.message,
          location: error.location
        });
      }
  }
  fetchImageData(imgKey)
})
  
  module.exports = {imagesRouter};