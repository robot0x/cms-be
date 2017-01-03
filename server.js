'use strict'
const express = require('express')
const app = express()
const router = express.Router()
const compression = require('compression')()
const config = require('./package').config
const API = require('./config/api')
const ServiceFactory = require('./service/ServiceFactory')
const _ = require('lodash')
const server_timestamp = _.now()
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
// 启动压缩
app.use(compression)
// 处理options请求。设置response对象的可允许跨域的header信息
app.use(allowCors)
// 解析request对象中的body数据。处理好之后放到request对象上的body属性上供后续使用。
app.use(bodyParse)
// 把路由挂载至应用 不以根目录开始，以根目录下的 cms 目录作为路由中间件的开始匹配位置
app.use(`/${config.root}`, router)
app.use(function (err, req, res, next) {
  // 服务端错误
  return res.json({
    status: 500,
    server_timestamp: server_timestamp,
    message: `后端报错：${err.stack}`
  })
})

/**
 * 有可能返回错误信息，但是数据库却更新成功了
 */

router.use(bodyJSON)
router.all(/(\w+)/i, requestHandler)

function requestHandler (req, res, next) {
  const p = req.params[0]
  const action = API[p]
  // 返回给调用端的数据
  const ret = {
    status: 200,
    message: 'SUCCESS',
    server_timestamp: server_timestamp
  }

  if (!action) {
    ret.status = 404
    ret.message = 'Invalid action'
    return res.json( ret )
  }

  const APIINPUT = req.APIINPUT
  if( APIINPUT && !_.isEmpty(APIINPUT) ){
    ret.APIINPUT = APIINPUT
  }
  const method = req.method.toUpperCase()
  const paramCheck = checkArgs(action, method, APIINPUT)
  const isValid = paramCheck.isValid

  if (!isValid) {
    ret.status = 400
    ret.message = `Invalid param：${paramCheck.message}`
    // 参数不符合要求
    return res.json(ret)
  }

  /**
   * 调用栈：
   *  ServiceFactory -> ArticlesService.js -> ArticleContentTable.js -> DB.js
   *  层层返回Promise，释放connection和事务处理在xxxTable.js中进行
   */
  const serviceFactory = new ServiceFactory(action)
  const service = serviceFactory.getService()
  let promise = null
  switch (method) {
    case 'POST':   // 增
      promise = service.save(APIINPUT)
      break
    case 'DELETE': // 删
      promise = service.delete(APIINPUT)
      break
    case 'PUT':    // 改
      promise = service.update(APIINPUT)
      break
    // case 'PATCH':  // 改
    //   promise = service.update(APIINPUT, true)
    //   break
    case 'GET':    // 查
      promise = service.list(APIINPUT)
      break
    default:
      ret.status = 405
      ret.message = 'Invalid method'
      res.json(ret)
  }

  if( promise ){
    promise
    .then(result => {
      ret.res = result
      res.json(ret)
    })
    .catch( err => {
      console.log(err)
      ret.status = 500
      ret.message = `后端报错：${err.stack}`
      res.json(ret)
    })
  }

}

function checkArgs (action, method, arg) {
  // 如果没有arg，就不用检查
  if(!arg) {
    return {
      isValid: true
    }
  }
  // DELETE POST PUT 都需要传参数，无参数，就提示
  if(['DELETE','POST', 'PUT'].indexOf(method) !== -1){
    if(_.isEmpty(arg)){
      return {
        isValid: false,
        message: '参数不能为空'
      }
    }
    // DELETE PUT 由于必修要指定对那个资源进行操作，所以必须有id
    if( method !== 'POST' ){
      if( arg.id != null){
        if(!_.toInteger(arg.id)){
          return {
            isValid: false,
            message: 'id格式不正确'
          }
        }
      }else{
        return {
          isValid: false,
          message: '没有指定id'
        }
      }
    }
  }
  // 如果参数中有 id 和 limit 则其类型必须是整数类型
  if( arg.id != null){
    if( !_.toInteger(arg.id) ){
      return {
        isValid: false,
        message: 'id格式不正确'
      }
    }
  }

  if( arg.limit != null){
    if( !_.toInteger(arg.limit) ){
      return {
        isValid: false,
        message: 'limit格式不正确'
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
          req.APIINPUT = JSON.parse(req.body)
        }catch(e){
          req.APIINPUT = {}
        }
    }else if(['GET', 'DELETE'].indexOf(method) !== -1){
      req.APIINPUT = req.query
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
    if (data) {
      console.log(`[parseBody function] the data is ${req.body}`)
    }
    next()
  })
}

function allowCors (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,X-Request-With')

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}


app.listen(config.port)
