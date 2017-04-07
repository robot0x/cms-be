const log4js = require("log4js");
const cfg = require("../config/log4js.json")
log4js.configure(cfg)

class Log {
  static getLog4js() {
    return log4js
  }
  static getLogger(category = 'cms_var') {
    return log4js.getLogger(category)
  }
}

module.exports = Log
