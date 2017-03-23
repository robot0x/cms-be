const _ = require('lodash')
const Promise = require('bluebird')
const ArticleMetaTable = require('../db/ArticleMetaTable')
const ArticleContentTable = require('../db/ArticleContentTable')
const articleMetaTable = new ArticleMetaTable()
const articleContentTable = new ArticleContentTable()
const log4js = require('log4js')
const logger = log4js.getLogger()

class ArticlesService {

  constructor(){
    logger.log('ArticlesService 实例化了....')
  }

  /**
   * 更新一篇文章
   * /articles METHOD:PUT
   */
  update (param) {
    return new Promise((resolve, reject) => {
      const { type } = param
      let promise = null
      logger.info('ArticlesService 24', type)
      if(type === 'all'){
        promise = articleMewtaTable.updateAll(param)
      } else {
        promise = articleMetaTable.update(param)
      }
      return promise
              .then(result => {
                resolve(result)
              }).catch(err => reject(err))
    })
  }

  /**
   * 新增一片文章
   */
  create (param) {
    return articleMetaTable.create(param)
  }

  list (param) {
    return new Promise((resolve, reject) => {
      logger.info('ArticlesService 20:', param)
      const {offset, limit, id, title, ctype, user, time, type, author, month} = param
      let limitObj = null
      let promise = null
      let isAll = false

      if(_.toInteger(limit)){
        limitObj = { offset:_.toInteger(offset) || 0, limit }
      }

      if(!param && _.isEmpty(param)){
        promise = articleMetaTable.getAll()
      }

      if(param.id && _.toInteger(id)){
          promise = articleMetaTable.getById(id)
      }

      if(title){
        promise = articleMetaTable.getByTitle(title, null, limitObj, 'like' in param)
      }

      if(param.ctype){
        promise = articleMetaTable.getByCtype(ctype, null, limitObj)
      }

      if(param.user){
        promise = articleMetaTable.getByUser(user, null, limitObj, 'like' in param)
      }

      if(author){
        promise = articleMetaTable.getByAuthor(author, null, limitObj, 'like' in param)
      }

      if(time){
        promise = articleMetaTable.getByTime(time, null, limitObj)
      }

      if(month){
        promise = articleMetaTable.getByMonth(month + '-0', null, limitObj)
      }

      if(type){
        if(type === 'all'){
          logger.info('ArticlesService exec ... all')
          promise = articleMetaTable.all(id, user)
          isAll = true
        } else if(type === 'monthly') {
            promise = articleMetaTable.getStatisticsByMonthly()
        } else if(type === 'release'){
            promise = articleMetaTable.release(id, user)
        } else if (type === 'lock'){
            promise = articleMetaTable.lock(id, user)
        }
      }
      // /articles/?offset=0&limit=2  METHOD:GET
      if(!promise){
        promise = articleMetaTable.getAll(null, limitObj)
      }

      return promise
              .then(result => {
                logger.info('ArticlesService 103', result)
                resolve(result)
              }).catch(err => reject(err))
    })
  }

  // _getTableByType( type ){
  //   let table = null
  //   if( type && _.isString(type) && type.toLowerCase() === 'content' ) {
  //     table = articleContentTable
  //   } else {
  //     table = articleMetaTable
  //   }
  //   return table
  // }
  // save(param){
  //   logger.log('ArticlesService save...', param)
  //   return new Promise((resolve, reject) => {
  //     this._getTableByType(param.type)
  //         .save(param)
  //         .then(result => resolve(result))
  //         .catch(err => reject(err))
  //   })
  // }
  // delete(param){
  //   return new Promise((resolve, reject) => {
  //     this._getTableByType(param.type)
  //         .deleteByNid(param.id)
  //         .then(result => resolve(result))
  //         .catch(err => reject(err))
  //   })
  // }
  // update(param){
  //   return new Promise((resolve, reject) => {
  //     this._getTableByType(param.type)
  //         .update(param)
  //         .then(result => resolve(result))
  //         .catch(err => reject(err))
  //   })
  // }
  // list(param){
  //   logger.log('ArticlesService 55:', param)
  //   if(!param && _.isEmpty(param)){
  //     articleMetaTable
  //   }
  //   return new Promise((resolve, reject) => {
  //     this._getTableByType(param.type)
  //         .list(param.id, param.limit)
  //         .then(rows => resolve(rows))
  //         .catch(err => reject(err))
  //   })
  // }
}

module.exports = ArticlesService
