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
    const {batch_key, alt, answer} = req.body
    const imgObj = {
      batch_key,
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

imagesRouter.get('/:batch_key', jsonParser, async (req, res, next) => {
  try{
    const batch_key = req.params.batch_key
    const imgData = await imageController.mongoFetchImgData(batch_key)
      if(imgData.length === 3){
        res.status(201).json(imgData);
      } else {
        let error = new Error('Returned Less Than 3 Imgs')
        error.status = 500 
        error.location = 'else statement of images post router '
        throw error
      }
    } catch(error) {
      next(error)
    }
})
  
  module.exports = {imagesRouter};