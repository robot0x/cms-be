const _ = require('lodash')
const Promise = require('bluebird')
const AuthorTable = require('../db/AuthorTable')
const authorTable = new AuthorTable()
const Log = require('../utils/Log')
const runLogger = Log.getLogger('cms_run')
const varLogger = Log.getLogger('cms_var')

class AuthorService{

  constructor(){
    console.log('AuthorService 实例化....')
  }

  save(param){
    console.log('AuthorService save...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .save(param)
          .then(result => resolve(result))
          .catch(err => {
            reject(err)
            runLogger.error(err)
          })
    })
  }

  delete(param){
    console.log('AuthorService delete...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .deleteById(param.id)
          .then(result => resolve(result))
          .catch(err => {
            reject(err)
            runLogger.error(err)
          })
    })
  }

  update(param){
    console.log('AuthorService update...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .update(param)
          .then(result => resolve(result))
          .catch(err => {
            reject(err)
            runLogger.error(err)
          })
    })
  }

  list(param){
    console.log('AuthorService 45:', param)
    return new Promise((resolve, reject) => {
      authorTable.getAll(null, param)
          .then(rows => resolve(rows))
          .catch(err => {
            reject(err)
            runLogger.error(err)
          })
    })
  }

}

module.exports = AuthorService
