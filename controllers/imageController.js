'use strict';

import aws from 'aws-sdk';
import fs from 'fs';
import { resolve } from 'path';

const {Images} = require('../models');

const imageController = {
    uploadImg: (imgObj) => {
        aws.config.setPromisesDependency();
        aws.config.update({
          accessKeyId: process.env.AWS_KEY,
          secretAccessKey: process.env.AWS_SECRET,
          region: process.env.AWS_REGION
        });
        const s3 = new aws.S3();
        var params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET,
            Body: fs.createReadStream(imgObj.path),
            Key: `./${imgObj.name}`
          };
          s3.upload(params, (err, data) => {
            if (err) {
              let err = new Error('Error occured while trying to upload to S3 bucket', err);
            }
            if (data) {
              fs.unlinkSync(imgObj.path); // Empty temp folder
              imgObj.locationUrl = data.Location;
              // Create new image mongo object w/ path to image file
              let newImage = new Image(imgObj)
              newImage.save() 
                .then(img => {
                  return resolve(img)
                })
                .catch(err => {
                  err.status = 500
                  err.location = 'uploadImg'
                  throw err
                })
            }
          });
    }
}

module.exports = {imageController};