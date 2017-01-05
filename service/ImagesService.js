const Promise = require('bluebird')
const ImageTable = require('../db/ImageTable')
const imageTable = new ImageTable()

class ImagesService{

  constructor(){
    console.log('ImagesService 实例化....');
  }

  save(param){
    console.log('ImagesService save...', param)
    return new Promise((resolve, reject) => {
      imageTable
          .save(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  delete(param){
    console.log('ImagesService delete...', param)
    return new Promise((resolve, reject) => {
      imageTable
          .deleteByNid(param.id)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  update(param){
    console.log('ImagesService update...', param)
    return new Promise((resolve, reject) => {
      imageTable
          .update(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  list(param){
    console.log('ImagesService list...', param)
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .list(param.id, param.limit)
          .then(rows => resolve(rows))
          .catch(err => reject(err))
    })
  }

}

module.exports = ImagesService
