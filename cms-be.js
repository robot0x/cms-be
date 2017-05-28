'use strict'
const express = require('express')
const app = express()
const router = express.Router()
const middleware = require('./middleware')
const config = require('./package').config
const API = require('./config/api')
const _ = require('lodash')
const Log = require('./utils/Log')
const ServiceFactory = require('./service/ServiceFactory')
// const cookieParser = require('cookie-parser')
const serverTimestamp = Date.now()

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

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
app.use(middleware.log())
// 启动压缩 -- 系统级中间件
app.use(require('compression')())
// 处理options请求。设置response对象的可允许跨域的header信息
app.use(middleware.allowCors)
// 解析request对象中的body数据。处理好之后放到request对象上的body属性上供后续使用。
app.use(middleware.bodyParse)
// bodyjson中间件必须在挂载router之前，router才能使用
app.use(middleware.bodyJSON)
// 把路由挂载至应用 不以根目录开始，以根目录下的 cms 目录作为路由中间件的开始匹配位置
app.use(`/${config.root}`, router)
// 错误处理中间件
app.use(middleware.errorHandler)
/**
 * 有可能返回错误信息，但是数据库却更新成功了
 */
// 路由级中间件
// router.use(bodyJSON)
router.all(/(\w+)/i, requestHandler)

function requestHandler (req, res, next) {
  // 获取请求参数
  const action = API[req.params[0]]
  // 返回给调用端的数据
  const response = {
    status: 200,
    message: 'SUCCESS',
    server_timestamp: serverTimestamp
  }
  // 如果请求的接口不存在，返回404。只有3个接口可供调用，分别是 articles/ users/ images/
  if (!action) {
    response.status = 404
    response.message = 'Invalid action'
    return res.json(response)
  }

  const body = req.body
  if (body && !_.isEmpty(body)) {
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
    case 'POST': // 新增（add)
      promise = service.create(body)
      break
    case 'DELETE': // 删
      promise = service.delete(body)
      break
    case 'PUT': // 修改（update）
      promise = service.update(body)
      break
    case 'GET': // 查
      promise = service.list(body)
      break
    default:
      response.status = 405
      response.message = 'Invalid method'
      res.json(response)
  }

  if (promise) {
    promise
      .then(result => {
        response.res = result
        // logger.info(result);
        res.json(response)
      })
      .catch(err => {
        Log.exception(err)
        response.status = 500
        response.message = `后端报错：${err}`
        res.json(response)
      })
  }
}

function checkArgs (action, method, body) {
  // console.log('action:', action)
  // DELETE POST PUT 都需要传参数，无参数，就提示
  if (['DELETE', 'PUT'].indexOf(method) !== -1) {
    if (_.isEmpty(body)) {
      return {
        isValid: false,
        message: '参数不能为空'
      }
    }
    // DELETE PUT 由于必修要指定对那个资源进行操作，所以必须有id
    if (body.id != null) {
      if (!_.toInteger(body.id)) {
        return {
          isValid: false,
          message: 'id格式不正确'
        }
      }
    } else if (action !== 'users') {
      return {
        isValid: false,
        message: '没有指定id'
      }
    }
  }
  // 如果参数中有 id 和 limit 则其类型必须是整数类型
  if (body) {
    if (body.id != null) {
      if (!_.toInteger(body.id)) {
        return {
          isValid: false,
          message: 'id格式不正确'
        }
      }
    }

    if (body.limit != null) {
      if (!_.toInteger(body.limit)) {
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

app.listen(config.port)