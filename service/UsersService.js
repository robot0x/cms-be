const Promise = require('bluebird')
const UserTable = require('../db/UserTable')
const authorTable = new UserTable()

class UsersService{

  constructor(){
    console.log('UserService 实例化....');
  }

  save(param){
    console.log('UserService save...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .save(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  delete(param){
    console.log('UserService delete...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .deleteByNid(param.id)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  update(param){
    console.log('UserService update...', param)
    return new Promise((resolve, reject) => {
      authorTable
          .update(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  list(param){
    console.log('UserService list...', param)
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .list(param.id, param.limit)
          .then(rows => resolve(rows))
          .catch(err => reject(err))
    })
  }
}

module.exports = UsersService
