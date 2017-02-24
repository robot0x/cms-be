const Table = require('./Table')
const log4js = require('log4js')
const logger = log4js.getLogger()

class UserTable extends Table {
  constructor(){
    super('user', [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '作者自增id',
      'name', // varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL unique COMMENT '帐号',
      'password', // varchar(30) NOT NULL COMMENT '密码',
      'type', // tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '作者类型，0-管理员/1-有调编辑/2-外部编辑，用来做权限控制',
      'online', // tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否在线，0-不在线/1-在线',
      'register_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
      // 'data' // text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
    ])
  }

  auth (user, password) {
    return new Promise((resolve, reject) => {
      super.exec(`SELECT COUNT(id) AS has FROM ${this.table} WHERE name='${user}' and password='${password}'`)
      .then(result => {
        logger.info('UserTable 19', result)
        resolve({
          auth: result[0].has > 0
        })
      })
      .catch(err => reject(err.message))
    })
  }

  getUserAndCount () {
    return super.exec(`SELECT user AS name, COUNT(a.id) AS count FROM article_meta AS a, ${this.table} AS u WHERE a.user = u.name GROUP BY u.name`)
  }

  exec(sql, data){
    return super.exec(sql, data)
  }
  // getByName (name) {
  //   return super.getByCond(`name = ${name}`)
  // }
  // deleteByName (name) {
  //   return super.deleteByCond(`name = ${name}`)
  // }
}

module.exports = UserTable
