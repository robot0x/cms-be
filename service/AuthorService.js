const _ = require('lodash')
const Promise = require('bluebird')
const AuthorTable = require('../db/AuthorTable')
const authorTable = new AuthorTable()
const Log = require('../utils/Log')

class AuthorService {
  constructor () {
    console.log('AuthorService 实例化....')
  }

  save (param) {
    console.log('AuthorService save...', param)
    return new Promise((resolve, reject) => {
      authorTable.save(param).then(result => resolve(result)).catch(err => {
        Log.exception(err)
        reject(err)
      })
    })
  }

  delete (param) {
    console.log('AuthorService delete...', param)
    return new Promise((resolve, reject) => {
      authorTable
        .deleteById(param.id)
        .then(result => resolve(result))
        .catch(err => {
          Log.exception(err)
          reject(err)
        })
    })
  }

  update (param) {
    console.log('AuthorService update...', param)
    return new Promise((resolve, reject) => {
      authorTable.update(param).then(result => resolve(result)).catch(err => {
        Log.exception(err)
        reject(err)
      })
    })
  }

  list (param) {
    console.log('AuthorService 45:', param)
    return new Promise((resolve, reject) => {
      let promise = null
      if (!param || _.isEmpty(param)) {
        promise = authorTable.getUserAndCount()
      } else {
        promise = authorTable.getAll(null, param)
      }
      promise.then(result => resolve(result)).catch(err => {
        Log.exception(err)
        reject(err)
      })
    })
  }
}

module.exports = AuthorService
