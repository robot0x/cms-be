'use strict'
const express = require('express')
const app = express()
const router = express.Router()
const compression = require('compression')()
const Utils = require('./utils/Utils')
const config = require('./package').config
const API = require('./config/api')
const ServiceFactory = require('./service/ServiceFactory')
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
console.log(API)
// 启动压缩
app.use(compression)
// 处理options请求。设置response对象的可允许跨域的header信息
app.use(Utils.allowCors)
// 解析request对象中的body数据。处理好之后放到request对象上的body属性上供后续使用。
app.use(Utils.bodyParse)
// 把路由挂载至应用 不以根目录开始，以根目录下的 cms 目录作为路由中间件的开始匹配位置
app.use(`/${config.root}`, router)
app.use(function (err, req, res, next) {
  // 服务端错误
  return res.json({
    status: 500,
    explain: err.stack
  })
})
router.use(Utils.bodyJSON)
router.all(/(\w+)/i, requestHandler)
// router.all(/(\w+)(\/:p)?/i, requestHandler)
function requestHandler (req, res, next) {
  const p = req.params[0]
  const action = API[p]
  if (!action) {
    // 非法action
    return res.json({
      status: 404,
      explain: 'Invalid action'
    })
  }
  const APIINPUT = req.APIINPUT
  const paramValid = checkArgs(p, APIINPUT)
  if (!paramValid) {
    // 参数不符合要求
    return res.json({
      status: 400,
      explain: 'Invalid param'
    })
  }
  const method = req.method
  const factory = new ServiceFactory(action)
  const service = factory.getService()
  console.log(service);
  switch (method) {
    case 'POST':   // 增
      // res.send(`/${action} post`)
      service.save(APIINPUT)
      res.json(APIINPUT)
      break
    case 'DELETE': // 删
      service.delete(APIINPUT)
      res.json(APIINPUT)
      break
    case 'PUT':    // 改
      service.update(APIINPUT)
      res.json(APIINPUT)
      break
    case 'PATCH':    // 改
      service.update(APIINPUT, true)
      res.json(APIINPUT)
      break
    case 'GET':    // 查
      service.list(APIINPUT, true)
      res.json(APIINPUT)
      break
  }

}

function checkArgs (action, arg) {
  return true
}

app.listen(config.port)
