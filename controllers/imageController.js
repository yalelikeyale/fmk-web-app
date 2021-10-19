'use strict';

const aws = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require('dotenv').config()
const AWS_KEY = process.env.AWS_KEY
const AWS_SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: AWS_KEY,
  accessKeyId: AWS_SECRET,
  region: "us-west-2",
});

const {Images} = require('../models');

const imageController = {
  checkFileType: (file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return resolve()
    } else {
      let err = new Error('Image must be file type png or jpeg')
      err.status = 422
      err.location = 'validateFile'
      throw err
    }
  },

  // awsUploadImg: (imgObj) => {
  //   //need to return something here
  //   const upload = multer({
  //     fileFilter,
  //     storage: multerS3({
  //       acl: "public-read",
  //       s3,
  //       bucket: AWS_BUCKET,
  //       metadata: {REPLACE ME WITH APPROPRIATE FUNCTION},
  //       key: {REPLACE ME WITH APPROPRIATE FUNCTION}
  //     })
  //   });
  //   // figure out how to return info about the aws s3 file that was just saved
  // },
  
  mongoStorePath: (awsImg) => {
    let Image = new Images(awsImg)
    Image.save()
      .then(img => {
        return resolve(img)
      })
      .catch(err => {
        err.status = 500
        err.location = 'mongoStorePath'
        throw err
      })
  },

  mongoFetchPath: (imgKey) => {
    Images.findOne({'image_key':imgKey})
      .then(img => {
        if(img){
          const cardData = img.genCardData()
          return resolve(cardData)
        } else {
          let err = new Error('Mongo did not respond with img')
          err.status = 500
          err.location = 'mongoFetchPath'
          throw err
        }
      })
  }
}

module.exports = {imageController};