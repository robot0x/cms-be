const DB = require('./DB')
const db = new DB()
const Promise = require('bluebird')
const _ = require('lodash')
const log4js = require('log4js')
const logger = log4js.getLogger()
/**
 * 所有业务表要继承的基类
 * 提供了一些常用的数据库操作
 * 所有继承该类的类在相应的Service中调用
 */
class Table {

  constructor(table, columns, format, orderByCol){
    this.table = table
    this.columns = columns
    if(format){
      const {columns, pattern} = format
      const formatColumns = columns.map(col => {
        return `DATE_FORMAT(${col},'${pattern}') AS ${col}`
      })
      this.columns = this.columns.concat(formatColumns)
    }
    this.columnsStr = this.columns.join(',')
    this.orderByCol = orderByCol
    this.db = db
  }

  create (param) {
    const title = '新建文章'
    if(!param || _.isEmpty(param)){
      param = { title }
    }
    if(!param.title){
      param.title = title
    }
    logger.info('table 30:', param)
    return this.exec(`  INSERT INTO article_meta SET ?`, param)
  }

  exec(sql, data){
    console.log(sql)
    // logger.info('Table.js 22:', data)
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

  total(where = ''){
    return this.exec(`SELECT count(id) AS count FROM ${this.table} ${where}`)
  }

  getById (id) {
    return this.exec(`SELECT ${this.columnsStr} FROM ${this.table} where id = ${id}`)
  }

  getAll(orderBy, pagination){
    orderBy = ` order by ${this.orderByCol} desc `
    let limitStr = ''
    if(pagination && !_.isEmpty(pagination)){
      limitStr = ` limit ${pagination.offset || 0}, ${pagination.limit} `
    }
    const sql = `select ${this.columnsStr} from ${this.table} ${orderBy} ${limitStr}`
    return this.exec(sql)
  }

  deleteByCond (cond = '') {
    const escapeValue = db.escapeValue(cond)
    const sql = `delete from ${this.table} where ${escapeValue.key} = ${escapeValue.value}`
    return this.exec(sql)
  }

  deleteById (id) {
    return this.deleteByCond(`id = ${id}`)
  }

  // /**
  //  *  根据参数，调用不同的方法
  //  */
  // list(nid, limit){
  //   // 门面模式
  //   nid = _.toInteger(nid)
  //   limit = _.toInteger(limit)
  //   if( nid ){
  //     return this.getByNid(nid)
  //   }else if( limit ){
  //     return this.getByCond(null, limit)
  //   }else{
  //     return this.getByCond(null, null, 'order by last_update_time desc')
  //   }
  // }
  //
  // getAll(orderBy, limit){
  //   // return this.getByCond()
  //   orderBy = ` order by ${this.orderByCol} `
  //   let limitStr = ''
  //   if(limit && !_.isEmpty){
  //     limitStr = ` limit ${limit.offset}, ${limit.limit} `
  //   }
  //   const sql = `select ${this.columnsStr} from ${this.table} ${orderBy} ${limitStr}`
  //   return this.exec(sql)
  // }
  //
  // getById (id) {
  //   return this.getByCond(`id = ${id}`)
  // }
  //
  // getByNid (nid) {
  //   return this.getByCond(`nid = ${nid}`)
  // }
  //
  // getByCond ( cond = '1 = 1', limit, order ) {
  //
  //   let sql = `select ${this.columns.join(',')}, (select count(1) from ${this.table}) as total from ${this.table} `
  //
  //   if( cond ){
  //     const escapeValue = db.escapeValue(cond)
  //     sql += `where ${escapeValue.key} = ${escapeValue.value} `
  //   }
  //
  //   if( limit ){
  //     sql += `limit ${limit} `
  //   }
  //
  //   if( order ){
  //     sql += order
  //   }
  //
  //   return this.exec(sql)
  // }
  //
  // update (data) {
  //   const id = data.id
  //   delete data.id
  //   const sql = `update ${this.table} set ? where nid = ${id}`
  //   return this.exec(sql, data)
  // }
  //
  // save (data) {
  //   data.nid = data.id
  //   delete data.id
  //   logger.info('Table.js 73:', data)
  //   const sql = `insert into ${this.table} (title) values ('新建文章')`
  //   // return this.exec(`insert into ${this.table} set ?`, data)
  //   return this.exec(sql)
  // }
  //

  //
  // deleteByNid (nid) {
  //   return this.deleteByCond(`nid = ${nid}`)
  // }

}

module.exports = Table
