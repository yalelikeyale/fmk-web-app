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
    console.log('made it past mongo store card data')
    if(dbImg){
      return res.status(201).json(dbImg)
    } else {
      let err = new Error('No dbImg to return')
      err.status = 500
      err.location = 'images post router'
      return res.status(err.status).json({err})
    }
  } catch (err) {
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
          return res.status(201).json(imgData);
        } else {
          let err = new Error('No Image Data Returned')
          err.status = 500
          err.location = 'Images Get Router'
          return res.status(err.status).json({err})
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