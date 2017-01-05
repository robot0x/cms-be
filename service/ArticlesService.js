const _ = require('lodash')
const Promise = require('bluebird')
const ArticleMetaTable = require('../db/ArticleMetaTable')
const ArticleContentTable = require('../db/ArticleContentTable')
const articleMetaTable = new ArticleMetaTable()
const articleContentTable = new ArticleContentTable()

class ArticlesService {

  constructor(){
    console.log('ArticlesService 实例化了....')
  }

  _getTableByType( type ){
    let table = null
    if( type && _.isString(type) && type.toLowerCase() === 'content' ) {
      table = articleContentTable
    } else {
      table = articleMetaTable
    }
    return table
  }

  save(param){
    console.log('ArticlesService save...', param)
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .save(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  delete(param){
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .deleteByNid(param.id)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  update(param){
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .update(param)
          .then(result => resolve(result))
          .catch(err => reject(err))
    })
  }

  list(param){
    console.log('ArticlesService list...', param)
    return new Promise((resolve, reject) => {
      this._getTableByType(param.type)
          .list(param.id, param.limit)
          .then(rows => resolve(rows))
          .catch(err => reject(err))
    })
  }
}

module.exports = ArticlesService
