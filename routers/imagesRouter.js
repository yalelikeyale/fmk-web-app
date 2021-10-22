'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { imageController } = require('../controllers');
const imagesRouter = express.Router();

const { awsUpload } = require('../middleware');

imagesRouter.post('/', awsUpload.single('img_file_name'), async (req, res, next) => {
  try{
    const img_file = req.file.originalname
    const {img_key, alt, answer} = req.body
    const imgObj = {
      img_key,
      img_file, 
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
      throw error
    }
  } catch (error) {
    next(error)
  }
})

imagesRouter.get('/:imagekey', jsonParser, (req, res, next) => {
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
          throw error
        }
      } catch(error) {
        next(error)
      }
  }
  fetchImageData(imgKey)
})
  
  module.exports = {imagesRouter};