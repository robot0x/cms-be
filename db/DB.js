const dbConfig = require('../config/db')
const mysql = require('promise-mysql')
class DB{

  constructor(){
    this.initPool()
  }

  escapeValue(cond){
    if(typeof cond === 'string'){
      let key = ''
      let value = ''
      if(cond.indexOf('=') !== -1){
        [key, value] = cond.split(/\s*=\s*/)
      }
      return {key, value: this.escape(value)}
    }
  }

  escape(str){
    console.log('escape------')
    return this.pool.escape(str)
  }

  initPool(){
    this.pool =  mysql.createPool(dbConfig)
  }

  getConnection(){
    return this.pool.getConnection()
  }

  releaseConnection(connection){
    return this.pool.releaseConnection(connection)
  }

  endConnection(connection){
    return connection.end()
  }

}

module.exports = DB
