const path = require('path')
/**
 * log4js日志系统配置文件
 * 共有四种日志：
 *  1. http日志
 *  2. 业务日志
 *  3. 异常日志
 *  4. 控制台打印
 *
 * 日志级别：
 *  1. trace
 *  2. debug
 *  3. info
 *  4. wran
 *  5. error
 *  6. fatal
 *  当日志级别为info，则不会打印出低于info级别的日志，即只会打印出info,wran,error,fatal，
 *  这样做的好处在于，在生产环境中我们可能只关心异常和错误，并不关心调试信息，从而大大减少日志的输出
 */
/**
 *  比如使用绝对路径来定位 filename，否则用 './logs/'这种方式，在那个目录下使用了log4js
 *  就会在那个目录下生成logs目录，这样就很麻烦，日志分散在各个dir下
 */
const theAbsolutePathDirOfLogfiles = path.resolve(__dirname, '../', 'logs')
// https://github.com/nomiddlename/log4js-node/wiki/Layouts
// 2017-05-13 13:16:07.464 [INFO] - 这是一条业务
const pattern = '[%d] [%p] - %m'
const log4jsConfig = {
  appenders: [{
    type: 'console',
    category: 'console'
  }, {
    //
    category: 'http',
    type: 'file',
    filename: `${theAbsolutePathDirOfLogfiles}/http/access.log`,
    // 当http日志文件超过200kb，会自动生成 http.log.1/http.log.2/ ... 以此类推
    // 后面的数字有 buckups 的大小决定
    maxLogSize: 204800,
    backups: 10
  }, {
    // 最终生成的业务log文件形如：business.log.2017-05-13
    category: 'business',
    type: 'dateFile',
    filename: `${theAbsolutePathDirOfLogfiles}/business/business`,
    alwaysIncludePattern: true,
    pattern: '.log.yyyy-MM-dd',
    layout: {
      type: 'pattern',
      pattern
    }
  }, {
    // 最终生成的异常log文件形如：exception.log.2017-05-13
    category: 'exception',
    type: 'dateFile',
    filename: `${theAbsolutePathDirOfLogfiles}/exception/exception`,
    alwaysIncludePattern: true,
    pattern: '.log.yyyy-MM-dd',
    layout: {
      type: 'pattern',
      pattern
    }
  }],
  replaceConsole: true,
  levels: {
    business: 'info',
    exception: 'ALL',
    http: 'ALL',
    console: 'ALL'
  }
}

module.exports = log4jsConfig

// {
//     "appenders":
//         [
//             {
//                 "type":"console",
//                 "category":"console"
//             },
//             {
//                 "category":"cms_http",
//                 "type": "file",
//                 "filename": "./logs/http.log",
//                 "maxLogSize": 104800,
//                 "backups": 100,
//                 "layout": {
//                   "type": "pattern",
//                   "pattern": "[%d{DATE}] %m"
//                 }
//             },
//             {
//                 "category":"cms_var",
//                 "type": "dateFile",
//                 "filename": "./logs/cms_var/cms_var",
//                 "alwaysIncludePattern": true,
//                 "pattern": ".log.yyyy-MM-dd"
//             },
//             {
//                 "category":"cms_run",
//                 "type": "dateFile",
//                 "filename": "./logs/cms_run/cms_run",
//                 "alwaysIncludePattern": true,
//                 "pattern": ".log.yyyy-MM-dd"
//             }
//         ],
//     "replaceConsole": true,
//     "levels":
//     {
//         "cms_var":"ALL",
//         "cms_run":"ALL",
//         "cms_http":"ALL",
//         "console":"ALL"
//     }
// }
