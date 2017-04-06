const _ = require('lodash')
const Promise = require('bluebird')
const AuthorTable = require('../db/AuthorTable')
const authorTable = new AuthorTable()
const log4js = require('log4js')
const logger = log4js.getLogger()

class AuthorService{

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
          .deleteById(param.id)
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
      authorTable.getAll()
          .then(rows => resolve(rows))
          .catch(err => reject(err))
    })
  }

}

module.exports = AuthorService
