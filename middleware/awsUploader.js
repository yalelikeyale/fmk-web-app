'use strict';

const aws = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require('dotenv').config()
const AWS_KEY = process.env.AWS_KEY
const AWS_SECRET = process.env.AWS_SECRET
const AWS_BUCKET = process.env.AWS_BUCKET
const AWS_REGION = process.env.AWS_REGION

aws.config.update({
    secretAccessKey: AWS_SECRET,
    accessKeyId: AWS_KEY,
    region: AWS_REGION
  })
  
const s3 = new aws.S3();

const awsUpload = multer({
    storage: multerS3({
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        bucket: AWS_BUCKET,
        metadata: function(req, file, cb) {
          cb(null, {fieldName: "file.fieldname"});
        },
        key: function(req, file, cb) {
          cb(null, file.originalname);
        }
    })
});

module.exports = {awsUpload}
