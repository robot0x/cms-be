const DB = require('./DB')
const db = new DB()
const Promise = require('bluebird')
const _ = require('lodash')
const Log = require('../utils/Log')
/**
 * 所有业务表要继承的基类
 * 提供了一些常用的数据库操作
 * 所有继承该类的类在相应的Service中调用
 */
class Table {
  constructor (table, columns, format, orderByCol) {
    this.table = table
    this.columns = columns
    if (format) {
      const { columns, pattern } = format
      this.columns = this.columns.concat(
        columns.map(col => `DATE_FORMAT(${col},'${pattern}') AS ${col}`)
      )
    }
    this.columnsStr = this.columns.join(',')
    this.orderByCol = orderByCol
    this.db = db
  }

  create (param) {
    const title = '新建文章'
    if (!param || _.isEmpty(param)) {
      param = { title }
    }
    if (!param.title) {
      param.title = title
    }
    return this.exec(`INSERT INTO diaodiao_article_meta SET ?`, param)
  }

  exec (sql, data) {
    const self = this
    return new Promise((resolve, reject) => {
      self.db.getConnection().then(connection => {
        // connection.beginTransaction().then(() => {
        connection
          .query(sql, data)
          .then(rows => {
            Log.business(
              `[DB.exe] ${sql} ${data ? `with ${JSON.stringify(data)}` : ''}\nfetch rows\'s length is ${rows.length} `
            )
            resolve(rows)
            // connection.commit()
          })
          .catch(err => {
            Log.exception(err)
            reject(err)
            // connection.rollback()
            // runLogger.error(err)
          })
          .finally(() => {
            // 一定要释放连接，否则可能导致连接池中无可用连接而hang住数据库
            // 2017-05-15 发现若没有release连接，则用http请求接口也一致是pending状态
            db.releaseConnection(connection)
          })
        // }).catch(err => {
        //   reject(err)
        //   connection.rollback()
        //   runLogger.error(err)
        // }).finally(() => {
        //   // 一定要释放连接，否则可能导致连接池中无可用连接而hang住数据库
        //   db.releaseConnection(connection)
        // })
      })
    })
  }

  total (where = '') {
    return this.exec(`SELECT count(id) AS count FROM ${this.table} ${where}`)
  }

  getById (id) {
    return this.exec(
      `SELECT ${this.columnsStr} FROM ${this.table} WHERE id = ${id}`
    )
  }

  // getByCond ({key, value}) {
  //   return this.exec(`SELECT ${this.columnsStr} FROM ${this.table} where ${key} = '${value}'`)
  // }

  getAll (orderBy, pagination) {
    orderBy = orderBy || ''
    if (orderBy) {
      orderBy = ` ORDER BY ${this.orderByCol} DESC `
    }
    let limitStr = ''
    if (pagination && !_.isEmpty(pagination)) {
      limitStr = ` LIMIT ${pagination.offset || 0}, ${pagination.limit} `
    }
    const sql = `SELECT ${this.columnsStr} FROM ${this.table} ${orderBy} ${limitStr}`
    console.log('table 87', sql)
    return this.exec(sql)
  }

  deleteByCond (cond = '') {
    const escapeValue = db.escapeValue(cond)
    const sql = `DELETE from ${this.table} WHERE ${escapeValue.key} = ${escapeValue.value}`
    return this.exec(sql)
  }

  deleteById (id) {
    return this.deleteByCond(`id = ${id}`)
  }
}

module.exports = Table
