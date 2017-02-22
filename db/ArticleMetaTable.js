const _ = require('lodash')
const Table = require('./Table')
const log4js = require('log4js')
const logger = log4js.getLogger()

class ArticleMetaTable extends Table {

  constructor() {
    super('article_meta', [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      // 'nid', // int(11) unsigned NOT NULL unique COMMENT '文章的短id',
      'title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'share_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wx_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wb_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'ctype', // tinyint(2) unsigned NOT NULL COMMENT '文章类型',
      'create_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
      'last_update_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
      'user', // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
      'author', // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章作者id',
      'lock_by', // varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '被那个作者锁定',
      'last_update_by', // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
      // 'data' // text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
    ],
    'last_update_time'
    )
  }

  create (param) {
    return new Promise((resolve, reject) => {
      super.create(param).then(result => {
        resolve({id: result.insertId})
      })
      .catch(err => reject(err.message))
    })
  }

  getAll(orderBy, limit){
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.getAll(orderBy, limit).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             }).catch(err => reject(err.message))
          }).catch(err => reject(err.message))
      }else{
        super.getAll(orderBy, limit)
        .then(result => {
          resolve({
            articles: result
          })
        }).catch(err => reject(err.message))
      }
    })
  }

  getById (id) {
    return super.getById(id)
  }
  /**
   * title[String] 要查询的title
   * orderBy[String] 排序字符串，如：order by last_update_time
   * pagination[Object] 分页参数，如：{offset:0, limit: 50}
   * isLike[Boolean] 是否是分页查询
   */
  getByTitle (title, orderBy, pagination, isLike) {
    let where = ` where title = '${title}' `
    if(isLike){
      where = ` where title like '%${title}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    let sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(err => reject(err.message))
          })
          .catch(err => reject(err.message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(err => reject(err.message))
      }
    })

  }

  getByCtype (ctype, orderBy, pagination){
    let where = ` where ctype = '${ctype}' `
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(err => reject(err.message))
          })
          .catch(err => reject(err.message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(err => reject(err.message))
      }
    })
  }

  getByUser (user, orderBy, pagination, isLike) {
    let where = ` where user = '${user}' `
    if(isLike){
      where = ` where user like '%${user}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(err => reject(err.message))
          })
          .catch(err => reject(err.message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(err => reject(err.message))
      }
    })
  }

  getByAuthor (author, orderBy, pagination, isLike) {
    let where = ` where author = '${author}' `
    if(isLike){
      where = ` where author like '%${author}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(err => reject(err.message))
          })
          .catch(err => reject(err.message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(err => reject(err.message))
      }
    })
  }
  /**
   * TODO: 传入的time为 timestamp
   */
  getByTime (time, orderBy, pagination){
    let where = ` where time = '${time}' `
    if(isLike){
      where = ` where time like '%${time}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(err => reject(err.message))
          })
          .catch(err => reject(err.message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(err => reject(err.message))
      }
    })
  }

  all (id){
    return super.all(id)
  }



  _getOrderBy (orderBy) {
    orderBy = orderBy || ''
    if(!orderBy){
      orderBy = ` order by ${this.orderByCol} desc `
    }
    return orderBy
  }

  _getPagination (pagination){
    let limit = ''
    if(pagination && !_.isEmpty(pagination)){
      limit = ` limit ${pagination.offset}, ${pagination.limit} `
    }
    return limit
  }
  // getByTitle (title) {
  //   return super.getByCond(`title = ${title}`)
  // }
  // deleteByName (name) {
  //   return super.deleteByCond(`name = ${name}`)
  // }
  // save(data){
  //   // 新增时，如果没有指定 lock_by 和 last_update_by，则默认这两个字段和 author 一样
  //   const author = data.author
  //   const lock_by = data.lock_by
  //   const last_update_by = data.last_update_by
  //   if(!lock_by){
  //     data.lock_by = author
  //   }
  //   if(!last_update_by){
  //     data.last_update_by = author
  //   }
  //   return super.save(data)
  // }
}

module.exports = ArticleMetaTable
