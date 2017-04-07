const _ = require('lodash')
const Table = require('./Table')
const Log = require('../utils/Log')
const runLogger = Log.getLogger('cms_run')
const varLogger = Log.getLogger('cms_var')

class AuthorTable extends Table {
  constructor() {
    super('author', [
      'id',
      'source',
      'pic_uri',
      'title',
      'intro',
      'type',
      'link',
      'naming',
      'value',
      'brief'
    ],'', 'id'
    )
  }
  getAll(orderBy, limit){
    return new Promise((resolve, reject) => {
      logger.info(limit)
      if(limit){
        super.total().then(countRes => {
             super.getAll(null, limit).then(result => {
               resolve({
                 total: countRes[0].count,
                 authors: result
               })
             }).catch(err => {
               reject(err)
               runLogger.error(err)
             })
          }).catch(err => {
            reject(err)
            runLogger.error(err)
          })
      }else{
        super.getAll(null, limit)
        .then(result => {
          resolve({
            authors: result
          })
        }).catch(err => {
          reject(err)
          runLogger.error(err)
        })
      }
    })
  }
}

module.exports = AuthorTable
