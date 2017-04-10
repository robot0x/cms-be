const Promise = require('bluebird')
const TagTable = require('../db/TagTable')
const tagTable = new TagTable()
const log4js = require('log4js')
const logger = log4js.getLogger()

class TagsService {

  // constructor () {
  //   console.log('TagService 实例化....');
  // }

  list () {
    return new Promise((resolve, reject) => {
      return tagTable.getAll()
              .then(result => {
                resolve(result)
              })
              .catch(err => reject(err))
    })
  }
}

module.exports = TagsService
