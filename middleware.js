const Log = require('./utils/Log')
const UserTable = require('./db/UserTable')
const userTable = new UserTable()

module.exports = {
  async tokenAuth (req, res, next) {
    /**
     * 首先判断是否是登录接口，
     * 如果是登录接口的话，不进行处理，next
     * 否则，取出cookie和Authentication头的值
     * 如果有值且值在数据库中存在且不过期，则next
     * 如果不满足上述条件，则返回 403 给前端和客户端
     */
    // /users/?user=liyanfeng&password=1234
    let url = req.url
    console.log(JSON.stringify(req.headers))
    // 如果是登录接口，不进行token验证，直接放行即可
    if (/\/users\/\?user=(.+?)&password=(.+)/i.test(url)) {
      console.log('命中登录接口')
      next()
    } else {
      let authenticationHeader = req.get('authentication')
      let authenticationCookie = req.cookies.token
      let token = authenticationCookie || authenticationHeader || ''
      let INVALID = {
        status: 401,
        server_timestamp: Date.now(),
        message: `Unauthorized: Invalid token ${token}`
      }
      console.log('token:', token)
      // 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
      // 403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
      // token不是40位以数字和字母组合的字符串，则无需验证直接返回401即可
      if (!/[a-z0-9]{40}/.test(token)) {
        return res.json(INVALID)
      } else {
        let data = await userTable.authToken(token)
        if (typeof data === 'string') {
          INVALID.message = `${data} ${token}}`
          res.json(INVALID)
        } else {
          // 如果token合法，则挂载到req对象上，因为后面某些接口需要用到token
          // 用到token的接口为 lock 和 releaselock，不再采用get方式传递user的方式锁定了
          // 这样是不安全的，前端如果改了user，则出出现一个匪夷所思的user
          req.__token__ = token
          next()
        }
      }
    }
  },

  allowCors (req, res, next) {
    let { headers } = req
    // 如果带cookie，必须不能设置为 * ，也不能设置为 a.dx2.com, b.dx2.com ... 等
    // 只能设置为一个值
    res.header('Access-Control-Allow-Origin', headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    // 如果前端fetch或ajax带cookie的话，必须设置Î credentials 头为true
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Content-Length,Authorization,X-Request-With,Cookie'
    )
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  },

  // 处理request请求数据
  bodyParse (req, res, next) {
    let data = ''
    // 取出请求数据
    req.on("data", chunk => data += chunk); // eslint-disable-line
    req.on('end', () => {
      // 把请求数据放到request对象上的body属性中
      // GET DELETE body为一个空行
      req.body = data
      // if (data && req.body) {
      //   // console.log('cms 228:', req.body)
      //   varLogger.info(`[parseBody function] the data is ${req.body}`)
      // }
      next()
    })
  },

  // 请求数据parse
  bodyJSON (req, res, next) {
    const method = req.method
    if (['POST', 'PUT'].indexOf(method) !== -1) {
      try {
        let authenticationHeader = req.get('authentication')
        let authenticationCookie = req.cookies.token
        let token = authenticationCookie || authenticationHeader || ''
        console.log('bodyJSON.token:', token)
        // 如果 req.body 为 空字符串或裸字符串，则parse会出异常
        req.body = JSON.parse(req.body)
      } catch (e) {}
    } else if (['GET', 'DELETE'].indexOf(method) !== -1) {
      req.body = req.query
    }
    next() // 没有这一行，所有接口都会hang住
  },

  errorHandler (err, req, res, next) {
    console.log(err)
    // 服务端错误
    return res.json({
      status: 500,
      server_timestamp: Date.now(),
      message: `后端报错：${err}`
    })
  },

  log () {
    return Log.getLog4js().connectLogger(Log.getHttpLogger(), {
      level: 'auto', // https://github.com/nomiddlename/log4js-node/wiki/Connect-Logger
      // format: ':remote-addr - ":method :url HTTP/:http-version" :status :referrer ":user-agent" :response-time ms', // http://www.senchalabs.org/connect/logger.htm
      format: ':remote-addr - ":method :url HTTP/:http-version" :status ":user-agent" :response-time ms', // http://www.senchalabs.org/connect/logger.htm
      nolog: /\.(gif|jpe?g|png|css|js)$/i // 不打印静态资源
    })
  }
}
