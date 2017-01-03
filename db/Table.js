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

  list(nid, limit){
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

    let sql = `select ${this.columns.join(',')} from ${this.table} `

    if( cond ){
      const escapeValue = db.escapeValue(cond)
      sql += `where ${escapeValue.key} = ${escapeValue.value} `
    }

    if( limit ){
      sql += `limit ${limit} `
    }

    console.log(sql)
    return this.exec(sql)
  }

  update (data, cond) {

    if(Array.isArray(data)){
      data = data.join(',')
    }

    if(_.isObject(data)){
      data = _.transform(data, (result, value, key) => { result.push(`${key}=${db.escape(value)}`) }, []);
    }

    const sql = `update ${this.table} set ${data} where ${cond}`
    console.log(sql)
    return this.exec(sql)
  }

  save (data) {
    return this.exec(`insert into ${this.table} set ?`, data)
  }

  deleteByCond (cond = '') {
    const escapeValue = db.escapeValue(cond)
    const sql = `delete from ${this.table} where ${escapeValue.key} = ${escapeValue.value}`
    console.log(sql)
    return this.exec(sql)
  }

  deleteById (id) {
    return this.deleteByCond(`id = ${id}`)
  }

  deleteByNid (nid) {
    return this.deleteByCond(`nid = ${nid}`)
  }

  exec( sql = '', data){
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
