'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const aws = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require('dotenv').config()
const AWS_KEY = process.env.AWS_KEY
const AWS_SECRET = process.env.AWS_SECRET
const AWS_BUCKET = process.env.AWS_BUCKET
const AWS_REGION = process.env.AWS_REGION

const { imageController } = require('../controllers');

aws.config.update({
  secretAccessKey: AWS_SECRET,
  accessKeyId: AWS_KEY,
  region: AWS_REGION
})

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: AWS_BUCKET,
    metadata: function(req, file, cb) {
      console.log("passed1"); // prints
      cb(null, {fieldName: "file.fieldname"});
    },
    key: function(req, file, cb) {
      console.log("passed2"); // prints
      cb(null, Date.now().toString());
    }
  })
});

const imagesRouter = express.Router();

imagesRouter.post('/', upload.single('img_file_name'), (req, res, next) => {
  console.log(req.file)
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