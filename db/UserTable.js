const Table = require('./Table')
const Log = require('../utils/Log')
// const moment = require('moment')
const Utils = require('../utils/Utils')
const mysql = require('promise-mysql')
// token过期时间
const tokenExpire = require('../config/app').tokenExpire

class UserTable extends Table {
  constructor () {
    super('diaodiao_cms_user', [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '作者自增id',
      'name', // varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL unique COMMENT '帐号',
      'password', // varchar(30) NOT NULL COMMENT '密码',
      'type', // tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '作者类型，0-管理员/1-有调编辑/2-外部编辑，用来做权限控制',
      'online', // tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否在线，0-不在线/1-在线',
      'register_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
      'login_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
      'token' // char(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '账户 + 时间戳生成的token，采用sha1加密',
    ])
  }

  modifyPassword (user, password) {
    console.log('modifyPassword 执行了 ...')
    return new Promise((resolve, reject) => {
      super
        .exec(
          `UPDATE  ${this.table} SET password='${password}' WHERE name='${user}'`
        )
        .then(result => {
          console.log('UserTable 24', result)
          if (result.affectedRows) {
            resolve({ action: true })
          } else {
            resolve({ action: false })
          }
        })
        .catch(err => {
          Log.exception(err)
          reject(err)
        })
    })
  }

  async auth (user, password) {
    console.log('auth 执行了 ...')
    try {
      let result = await super.exec(
        `SELECT COUNT(id) AS has FROM ${this.table} WHERE name='${user}' and password='${password}'`
      )
      let token = await this.genToken(user)
      let auth = result[0].has > 0
      return { auth, token }
    } catch (error) {
      console.log(error)
      Log.exception(error)
    }
  }
  /**
   * 验证一个token是否有效，有效包括：
   *  1. 格式正确 由数字字母组成的40位串
   *  2. 数据库中存在
   *  3. 未过期
   * 任何一个条件不满足，都认为是非法的token
   * @memberof UserTable
   */
  async authToken (token) {
    // 不满足格式要求，直接返回
    if (!/[a-z0-9]{40}/.test(token)) return
    let data = await this.getByToken(token)
    if (!Utils.isValidArray(data)) return
    [data] = data
    console.log('authToken.data:', data)
    // token不存在，直接返回
    let loginTime = new Date(data.login_time).getTime()
    // 已经到了过期时间，直接返回
    if ((Date.now() - loginTime) / 1000 > tokenExpire) return
    return data
  }
  /**
   *
   * @param {any} user
   * @memberof UserTable
   * 1. 根据用户名和时间戳生成token
   * 2. 生成的token入库，并记录时间戳
   * 为了测试方便，token时间戳设置为1分钟过期
   */
  async genToken (user) {
    try {
      let date = new Date()
      let now = date.getTime()
      let key = user + now + Math.random()
      let token = Utils.getSha1(key)
      // 更新login_time 和 token 字段
      let sql = `UPDATE ${this.table} SET login_time = ${mysql.escape(date)}, token = ${mysql.escape(token)} WHERE name = ${mysql.escape(user)}`
      await super.exec(sql)
      return token
    } catch (error) {
      console.log(error)
      Log.exception(error)
    }
  }

  async getByToken (token) {
    let sql = `SELECT ${this.columnsStr} FROM ${this.table} WHERE token = ${mysql.escape(token)}`
    let data = await super.exec(sql)
    // console.log('sql:', sql)
    // console.log('data:', data)
    return data
  }

  getUserAndCount () {
    return super.exec(
      `SELECT user AS name, COUNT(a.id) AS count FROM diaodiao_article_meta AS a, ${this.table} AS u WHERE a.user = u.name GROUP BY u.name`
    )
  }
}

module.exports = UserTable
// test
// const ut = new UserTable()
// ut.authToken('7de6cb728832acc451f0c8c5b1e83260d68575b1').then(data => {
//   console.log('data:', data)
// })
