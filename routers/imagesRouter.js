
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { awsFileUpload } = require('../middleware')
const { imageController } = require('../controllers');

const imagesRouter = express.Router();

imagesRouter.post('/', awsFileUpload.single('img_file_name'), (req, res) => {
  let imgFiles = req.files
  console.log(imgFiles)
  res.status(200).send('uploaded!')
})

imagesRouter.get('/:imagekey', jsonParser, (req, res) => {
  const imgKey = req.params.image_key
  async function fetchImageData(key){
    try{
      const imgData = await imageController.mongoFetchPath(imgKey)
        if(imgData){
          return res.status(201).json(imgData);
        } else {
          let err = new Error('No Image Data Returned')
          err.status = 500
          err.location = 'Images Get Router'
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