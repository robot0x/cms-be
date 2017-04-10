const log4js = require("log4js");
const cfg = require("../config/log4js.json")
log4js.configure(cfg)

class Log {
  static handleMsg (msg) {
    const username = Log.username
    if(!username){
      return ''
    }
    let arg = msg
    if(typeof msg === 'object'){
      msg = JSON.stringify(msg)
    }else{
      msg = msg.toString()
    }
    if(msg.indexOf(`[${username}]：`) === -1){
      arg = `[${username}]：${msg}`
    }
    return arg
  }
  static setName (name) {
    Log.username = name
  }
  static getLog4js() {
    return log4js
  }
  static getLogger(category = 'cms_var') {
    var logger = log4js.getLogger(category)
    // var info = logger.info
    // var log = logger.log
    // var error = logger.error
    // logger.info = msg => {
    //   info.call(logger, Log.handleMsg(msg))
    // }
    // logger.log = msg => {
    //   log.call(logger, Log.handleMsg(msg))
    // }
    // logger.error = msg => {
    //   error.call(logger, Log.handleMsg(msg))
    // }
    return logger
  }
}

module.exports = Log
