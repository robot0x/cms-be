const dbConfig = require('../config/db')
const mysql = require('promise-mysql')
/**
 * 提供基础的与数据库相关的工具方法
 */
class DB {
  constructor () {
    this.initPool()
  }
  /**
   * 转码一个Object的value，防止sql注入
   */
  escapeValue (cond) {
    if (typeof cond === 'string') {
      let key = ''
      let value = ''
      if (cond.indexOf('=') !== -1) {
        [key, value] = cond.split(/\s*=\s*/)
      }
      return { key, value: this.escape(value) }
    }
  }

  /**
   * 转码，防止sql注入
   */
  escape (str) {
    return this.pool.escape(str)
  }

  /**
   * 根据配置初始化连接池
   */
  initPool () {
    this.pool = mysql.createPool(dbConfig)
  }

  /**
   * 从连接池中取出一个连接
   */
  getConnection () {
    return this.pool.getConnection()
  }

  /**
   * 释放一个连接到连接池中
   */
  releaseConnection (connection) {
    return this.pool.releaseConnection(connection)
  }
}

module.exports = DB
