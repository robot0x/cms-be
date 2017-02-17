const DB = require('./DB')
const db = new DB()
const Promise = require('bluebird')
const _ = require('lodash')

/**
 * 所有业务表要继承的基类
 * 提供了一些常用的数据库操作
 * 所有继承该类的类在相应的Service中调用
 */
class Table {

  constructor(table, columns){
    this.table = table
    this.columns = columns
    this.db = db
  }
  /**
   *  根据参数，调用不同的方法
   */
  list(nid, limit){
    // 门面模式
    nid = _.toInteger(nid)
    limit = _.toInteger(limit)
    if( nid ){
      return this.getByNid(nid)
    }else if( limit ){
      return this.getByCond(null, limit)
    }else{
      return this.getByCond()
    }
  }

  getAll(){
    return this.getByCond()
  }

  getById (id) {
    return this.getByCond(`id = ${id}`)
  }

  getByNid (nid) {
    return this.getByCond(`nid = ${nid}`)
  }

  getByCond ( cond = '1 = 1', limit ) {

    let sql = `select ${this.columns.join(',')}, (select count(1) from ${this.table}) as total from ${this.table} `

    if( cond ){
      const escapeValue = db.escapeValue(cond)
      sql += `where ${escapeValue.key} = ${escapeValue.value} `
    }

    if( limit ){
      sql += `limit ${limit} `
    }

    return this.exec(sql)
  }

  update (data) {
    const id = data.id
    delete data.id
    const sql = `update ${this.table} set ? where nid = ${id}`
    return this.exec(sql, data)
  }

  save (data) {
    data.nid = data.id
    delete data.id
    return this.exec(`insert into ${this.table} set ?`, data)
  }

  saveMax (data) {
    data.nid = data.id
    delete data.id
    // const sql = `insert into ${this.table} (nid, title,ctype,status,author) select MAX(nid) + 1, 'new article', 0, 2, 'liyanfeng' from article_meta`
    return this.exec(`insert into ${this.table} set ?`, data)
  }

  deleteByCond (cond = '') {
    const escapeValue = db.escapeValue(cond)
    const sql = `delete from ${this.table} where ${escapeValue.key} = ${escapeValue.value}`
    return this.exec(sql)
  }

  deleteById (id) {
    return this.deleteByCond(`id = ${id}`)
  }

  deleteByNid (nid) {
    return this.deleteByCond(`nid = ${nid}`)
  }

  exec( sql = '', data){
    console.log(sql)
    console.log('98行：', data)
    const self = this
    return new Promise((resolve, reject) => {
      self.db.getConnection().then(connection => {
        connection.beginTransaction().then(() => {
          connection.query(sql, data).then(rows => {
            resolve(rows)
            connection.commit()
          }).catch(err => {
            reject(err)
            connection.rollback()
          })
        })
        .catch(err => {
          reject(err)
          connection.rollback()
        }).finally(() => {
          // 一定要释放连接，否则可能导致连接池中无可用连接而hang住数据库
          db.releaseConnection(connection)
        })
      })
    })
  }
}

module.exports = Table
