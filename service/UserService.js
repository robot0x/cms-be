const _ = require('lodash')
const Promise = require('bluebird')
const UserTable = require('../db/UserTable')
// const authorTable = new UserTable()
const userTable = new UserTable()
const Log = require('../utils/Log')

class UsersService {
  // constructor () {
  //   console.log('UserService 实例化....');
  // }

  list (param) {
    return new Promise((resolve, reject) => {
      // const { offset, limit, id, user, password } = param
      const { user, password } = param
      let promise = null
      if (!param || _.isEmpty(param)) {
        promise = userTable.getUserAndCount()
      }
      if (user && password) {
        promise = userTable.auth(user, password)
      }
      return promise
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          Log.exception(err)
          reject(err)
        })
    })
  }
  update (param) {
    return new Promise((resolve, reject) => {
      console.log('param:', param)
      const { username, password } = param
      let promise = null
      if (username && password) {
        promise = userTable.modifyPassword(username, password)
      }
      return promise
        .then(result => {
          console.log('object：', result)
          resolve(result)
        })
        .catch(err => {
          Log.exception(err)
          reject(err)
        })
    })
  }
}

module.exports = UsersService
