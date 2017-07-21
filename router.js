const express = require('express')
const router = express.Router()
const API = require('./config/api')
const _ = require('lodash')
const Log = require('./utils/Log')
const ServiceFactory = require('./service/ServiceFactory')
const serverTimestamp = Date.now()
const AliVideoService = require('./service/AliVideoService')
const aliVideoService = new AliVideoService()

// 路由顺序跟书写顺序是一致的
router.get('/vid/callback/rawupdate', (req, res, next) => {
  console.log('[/vid/callback/rawupdate]视频管理相关接口命中 ...')
  console.log(req.body)
  next()
})
// 客户端请求上传token
router.get('/vid/token', (req, res, next) => {
  console.log('视频管理相关接口命中 ...')
  aliVideoService.genUploadToken
  res.json({
    status: 200,
    server_timestamp: Date.now(),
    message: 'SUCCESS',
    res: {
      token: aliVideoService.genUploadToken()
    }
  })
})
// 视频管理相关接口
router.get('/vid/query/person/', (req, res, next) => {
  console.log('视频管理相关接口命中 ...')
  res.json({
    hello: 'hello'
  })
})

// CMS后台相关restful接口
router.all(/(\w+)/i, requestHandler)
function requestHandler (req, res, next) {
  // console.log('CMS后台相关restful接口命中 ...，params:', req.params)
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
  let token = req.__token__
  console.log(`${req.url}requestHandler.token:`, token)
  const body = req.body
  // console.log(`${req.url}requestHandler.body:`, body)
  if (body && !_.isEmpty(body)) {
    if (token) {
      body.token = token
    }
    response.body = body
  } else if (token) {
    response.body = { token }
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

module.exports = router
