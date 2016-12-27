const dbConfig = require('../config/db')
const mysql = require('promise-mysql')
class DB{
  constructor(){
    this.initPool()
  }

  initPool(){
    this.pool =  mysql.createPool(dbConfig)
  }

  getConnection(){
    return this.pool.getConnection()
  }

  releaseConnection(connection){
    return connection.release()
  }

  endConnection(connection){
    return connection.end()
  }

  
}

module.exports = DB
