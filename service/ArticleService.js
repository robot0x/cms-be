const _ = require('lodash')
const Promise = require('bluebird')
const ArticleMetaTable = require('../db/ArticleMetaTable')
const articleMetaTable = new ArticleMetaTable()
// const ArticleContentTable = require('../db/ArticleContentTable')
// const articleContentTable = new ArticleContentTable()
const Log = require('../utils/Log')

class ArticlesService {
  // constructor(){
  //   console.log('ArticlesService 实例化了....')
  // }
  /**
   * 更新一篇文章
   * /articles METHOD:PUT
   */
  update (param) {
    return new Promise((resolve, reject) => {
      const {
        type
      } = param
      let promise = null
      console.log('ArticlesService varLogger24', type)
      if (type === 'all') {
        console.log('type === all ....')
        promise = articleMetaTable.updateAll(param)
      } else {
        console.log('type !== all ....')
        promise = articleMetaTable.update(param)
      }
      return promise
        .then(result => {
          resolve(result)
        }).catch(err => {
          reject(err)
          Log.exception(err)
        })
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
      console.log('ArticlesService 20:', param)
      const {
        offset,
        limit,
        id,
        title,
        ctype,
        user,
        time,
        type,
        author,
        month,
        token
      } = param
      let limitObj = null
      let promise = null
      // let isAll = false

      if (_.toInteger(limit)) {
        limitObj = {
          offset: _.toInteger(offset) || 0,
          limit
        }
      }

      if (!param && _.isEmpty(param)) {
        promise = articleMetaTable.getAll()
      }

      if (id && _.toInteger(id)) {
        promise = articleMetaTable.getById(id)
      }

      if (title) {
        promise = articleMetaTable.getByTitle(title, null, limitObj, 'like' in param)
      }

      if (ctype) {
        promise = articleMetaTable.getByCtype(ctype, null, limitObj)
      }

      if (user) {
        promise = articleMetaTable.getByUser(user, null, limitObj, 'like' in param)
      }

      if (author) {
        promise = articleMetaTable.getByAuthor(author, null, limitObj, 'like' in param)
      }

      if (time) {
        promise = articleMetaTable.getByTime(time, null, limitObj)
      }

      if (month) {
        promise = articleMetaTable.getByMonth(month + '-0', null, limitObj)
      }

      if (type) {
        if (type === 'all') {
          console.log('ArticlesService exec ... all')
          promise = articleMetaTable.all(id, user)
          // isAll = true
        } else if (type === 'monthly') {
          promise = articleMetaTable.getStatisticsByMonthly()
        } else if (type === 'release') {
          promise = articleMetaTable.release(id, token)
        } else if (type === 'lock') {
          promise = articleMetaTable.lock(id, token)
        }
      }
      // /articles/?offset=0&limit=2  METHOD:GET
      if (!promise) {
        promise = articleMetaTable.getAll(null, limitObj)
      }

      return promise
        .then(result => {
          // console.log('ArticlesService 103', result)
          resolve(result)
        }).catch(err => {
          reject(err)
          Log.exception(err)
        })
    })
  }
}

module.exports = ArticlesService
