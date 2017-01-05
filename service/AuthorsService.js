const Promise = require('bluebird')
const AuthorTable = require('../db/AuthorTable')
const authorTable = new AuthorTable()

class AuthorsService{

  constructor(){
    console.log('AuthorService 实例化....');
  }

  save(param){
    console.log('AuthorService save...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .save(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  delete(param){
    console.log('AuthorService delete...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .deleteByNid(param.id)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  update(param){
    console.log('AuthorService update...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .update(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  list(param){
    console.log('AuthorService list...', param)
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .list(param.id, param.limit)
          .then(rows => resolve(rows))
          .catch(err => reject(err))
    })
  }
}

module.exports = AuthorsService
