'use strict';

const { resolveInclude } = require('ejs');
const {Images} = require('../models');

const imageController = {

  mongoStoreCardData: async (imgObj) => {
    try{
      const img = await Images.create(imgObj)
      const cardData = await img.genCardData()
      if(cardData){
        return cardData
      } else {
        let err = new Error('No Card Data Returned')
        err.status = 500
        err.location = 'img gen card data'
        throw err
      }
    } catch(err) {
      throw err
    }
  },

  mongoFetchImgBatch: async (batch_key) => {
    try{
      const imgBatch = await Images.find({batch_key})
      console.log(imgBatch)
      imgBatch.map(img => {
        console.log(img)
        let cardData = img.genCardData()
        if(cardData){
          console.log(cardData)
          return cardData
        }
        let err = new Error('No Card Data Returned')
        err.status = 500
        err.location = 'imgBatch map'
        throw err
      })
      if(imgBatch===3){
        console.log(imgBatch)
        return imgBatch
      } else {
        let error = new Error('Less than 3 objects to return')
        throw error
      }
    } catch(err) {
      err.status = 500
      err.location = 'mongoFetchPath'
      throw err
    }
  }
}

module.exports = {imageController};