const _ = require('lodash')
const Table = require('./Table')
const log4js = require('log4js')
const logger = log4js.getLogger()

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
             }).catch(({message}) => reject(message))
          }).catch(({message}) => reject(message))
      }else{
        super.getAll(null, limit)
        .then(result => {
          resolve({
            authors: result
          })
        }).catch(({message}) => reject(message))
      }
    })
  }
}

module.exports = AuthorTable
