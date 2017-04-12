'use strict'
const express = require('express')
const app = express()
const router = express.Router()
const compression = require('compression')()
const config = require('./package').config
const API = require('./config/api')
const ServiceFactory = require('./service/ServiceFactory')
const _ = require('lodash')
// const cookieParser = require('cookie-parser')
const server_timestamp = _.now()
const Log = require('./utils/Log')
const varLogger = Log.getLogger('cms_var')
const runLogger = Log.getLogger('cms_run')
/**
  200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
  201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
  202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
  204 NO CONTENT - [DELETE]：用户删除数据成功。
  400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
  401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
  403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
  404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
  406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
  410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
  422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
  500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
 */
// app.use(cookieParser())
// 使用log4js记录http log
// app.use(Log.getLog4js().connectLogger(Log.getLogger('cms_http'), {format: ':remote-addr :method :url :status :response-time ms'}))
// app.use((req, res, next) => {
//   const {method, url} = req
//   if(method.toUpperCase() !== 'OPTIONS'){
//     Log.setName(req.get('name'))
//     // Log.name = req.get('name')
//     // Log.getLog4js().connectLogger(Log.getLogger('cms_http'), {format: ':method :url'})
//   }
//   next()
// })
app.use(Log.getLog4js().connectLogger(Log.getLogger('cms_http'), {format: ':method :url'}))
// 启动压缩 -- 系统级中间件
app.use(compression)
// 处理options请求。设置response对象的可允许跨域的header信息
app.use(allowCors)
// 解析request对象中的body数据。处理好之后放到request对象上的body属性上供后续使用。
app.use(bodyParse)
// 把路由挂载至应用 不以根目录开始，以根目录下的 cms 目录作为路由中间件的开始匹配位置
app.use(`/${config.root}`, router)
// 错误处理中间件
app.use(function (err, req, res, next) {
  runLogger.error(err)
  // 服务端错误
  return res.json({
    status: 500,
    server_timestamp: server_timestamp,
    message: `后端报错：${err.message}`
  })
})

/**
 * 有可能返回错误信息，但是数据库却更新成功了
 */
// 路由级中间件
router.use(bodyJSON)
router.all(/(\w+)/i, requestHandler)

function requestHandler (req, res, next) {
  // 获取请求参数
  const action = API[req.params[0]]
  // 返回给调用端的数据
  const response = {
    status: 200,
    message: 'SUCCESS',
    server_timestamp: server_timestamp
  }
  // 如果请求的接口不存在，返回404。只有3个接口可供调用，分别是 articles/ users/ images/
  if (!action) {
    response.status = 404
    response.message = 'Invalid action'
    return res.json( response )
  }

  const body = req.body
  if( body && !_.isEmpty(body) ){
    response.body = body
  }
  // logger.info('server.js 72:', body);
  const method = req.method.toUpperCase()
  const paramCheck = checkArgs(action, method, body)
  const isValid = paramCheck.isValid

  if (!isValid) {
    response.status = 400
    response.message = `Invalid param：${paramCheck.message}`
    // 参数不符合要求
    return res.json(response)
  }

  // logger.info('server.js 84:', body)
  // logger.info('server.js 85:', action)
  /**
   * 调用栈：
   *  ServiceFactory -> ArticlesService.js -> ArticleContentTable.js -> DB.js
   *  层层返回Promise，释放connection和事务处理在xxxTable.js中进行
   */
  const serviceFactory = new ServiceFactory(action)
  const service = serviceFactory.getService()
  let promise = null
  switch (method) {
    case 'POST':   // 新增（add)
      promise = service.create(body)
      break
    case 'DELETE': // 删
      promise = service.delete(body)
      break
    case 'PUT':    // 修改（update）
      promise = service.update(body)
      break
    case 'GET':    // 查
      promise = service.list(body)
      break
    default:
      response.status = 405
      response.message = 'Invalid method'
      res.json(response)
  }

  if( promise ){
    promise
    .then(result => {
      response.res = result
      // logger.info(result);
      res.json(response)
    })
    .catch( err => {
      runLogger.error(err)
      response.status = 500
      response.message = `后端报错：${err.stack}`
      res.json(response)
    })
  }

}

function checkArgs (action, method, body) {

  // DELETE POST PUT 都需要传参数，无参数，就提示
  if(['DELETE', 'PUT'].indexOf(method) !== -1){
    if(_.isEmpty(body)){
      return {
        isValid: false,
        message: '参数不能为空'
      }
    }
    // DELETE PUT 由于必修要指定对那个资源进行操作，所以必须有id
    if( body.id != null){
      if(!_.toInteger(body.id)){
        return {
          isValid: false,
          message: 'id格式不正确'
        }
      }
    } else {
      return {
        isValid: false,
        message: '没有指定id'
      }
    }
  }
  // 如果参数中有 id 和 limit 则其类型必须是整数类型
  if(body){
    if( body.id != null){
      if( !_.toInteger(body.id) ){
        return {
          isValid: false,
          message: 'id格式不正确'
        }
      }
    }

    if( body.limit != null){
      if( !_.toInteger(body.limit) ){
        return {
          isValid: false,
          message: 'limit格式不正确'
        }
      }
    }
  }

  return {
    isValid: true
  }

}

// 请求数据parse
function bodyJSON (req, res, next) {
    const method = req.method
    if(['POST','PUT'].indexOf(method) !== -1){
        try{
          // 如果 req.body 为 空字符串或裸字符串，则parse会出异常
          req.body = JSON.parse(req.body)
        }catch(e){
          req.body = null
        }
    }else if(['GET', 'DELETE'].indexOf(method) !== -1){
      console.log('cms 210:', req.query);
      req.body = req.query
    }
    next() // 没有这一行，所有接口都会hang住
}

// 处理request请求数据
function bodyParse (req, res, next) {
  let data = ''
    // 取出请求数据
  req.on('data', chunk => data += chunk) // eslint-disable-line
  /**
   *
   */
  req.on('end', () => {
    // 把请求数据放到request对象上的body属性中
    // GET DELETE body为一个空行
    req.body = data
    if (data && req.body) {
      console.log('cms 228:', req.body)
      varLogger.info(`[parseBody function] the data is ${req.body}`)
    }
    next()
  })
}

function allowCors (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  // res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,X-Request-With,name')
  console.log('cms 241:', req.url);
  console.log('cms 241:', req.query);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}


app.listen(config.port)
