
import express from 'express';
import multer from 'multer';
import { imageController } from '../controllers';

// this is where signup is grabbed ... bit different than i've been doing it 

const imagesRouter = express.Router();

imagesRouter.post('/', multer, (req, res) => {
    const imgObj = req.body
    async function uploadToAWS(imgObj){
      try{
          const imgData = imageController.uploadImg(imgObj)
        if(imgData){
          return res.status(201).json(imgData.path);
        } else {
          let err = new Error('No Image Data Returned')
          err.status = 500
          err.location = 'Images Router'
          throw err
        }
      } catch(error) {
        return Promise.reject({
          code: error.status,
          message: error.message,
          location: error.location
        });
      }
    }

  })
  
  module.exports = {usersRouter};