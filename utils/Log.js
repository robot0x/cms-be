const log4js = require('log4js')
const cfg = require('../config/log4js')
log4js.configure(cfg)
const bus = log4js.getLogger('business')
const exce = log4js.getLogger('exception')
const http = log4js.getLogger('http')
// business  业务日志
// exception 异常日志 抛出的error信息都会记录在这里
class Log {
  static getLog4js () {
    return log4js
  }
  static getHttpLogger () {
    return http
  }
  static business (msg) {
    bus.info(msg)
  }
  static exception (msg) {
    exce.error(msg)
  }
}

module.exports = Log
