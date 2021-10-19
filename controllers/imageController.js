'use strict';

const {Images} = require('../models');

const imageController = {

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