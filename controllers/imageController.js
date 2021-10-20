'use strict';

const { resolveInclude } = require('ejs');
const {Images} = require('../models');

const imageController = {

  mongoStoreCardData: async (imgObj) => {
    try{
      const img = await Images.create(imgObj)
      console.log('this is the image')
      console.log(img)
      const cardData = await img.genCardData()
      console.log('this is card data')
      console.log(cardData)
      if(cardData){
        console.log('made it inside if statement')
        return resolve(cardData)
      } else {
        let err = new Error('No Card Data Returned')
        err.status = 500
        err.location = 'img gen card data'
        throw err
      }
    } catch(err) {
      err.status = 500
      err.location = 'mongoStoreCard Data'
      throw err
    }
  },

  mongoFetchCardData: async (imgKey) => {
    try{
      const imgBatch = await Images.find({'image_key':imgKey})
      imgBatch.map(img => {
        let cardData = img.genCardData()
        if(cardData){
          return resolve(cardData)
        }
        let err = new Error('No Card Data Returned')
        err.status = 500
        err.location = 'imgBatch map'
        throw err
      })
    } catch(err) {
      err.status = 500
      err.location = 'mongoFetchPath'
      throw err
    }
  }
}

module.exports = {imageController};