const Promise = require('bluebird')
const UserTable = require('../db/UserTable')
const authorTable = new UserTable()
const userTable = new UserTable()
const log4js = require('log4js')
const logger = log4js.getLogger()

class UsersService {

  constructor () {
    console.log('UserService 实例化....');
  }

  list (param) {
    return new Promise((resolve, reject) => {
      logger.info('UsersService 14:', param)
      const {offset, limit, id, user, password} = param
      logger.info('UsersService 16:', user)
      logger.info('UsersService 17:', password)
      let promise = null
      if(user && password){
        promise = userTable.auth(user, password)
      }
      return promise
              .then(result => {
                resolve(result)
              })
              .catch(err => reject(err))
    })
  }
}

module.exports = UsersService
