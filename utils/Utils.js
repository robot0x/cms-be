class Utils {

  // 短id转长id
  static getLongCid (cid) {
    if (cid == void 0) { // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
  // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
    return cid > C
    ? cid
    : (C + 1) * cid
  }

 // 长id短id
  static getShortCid (cid) {
    if (cid == void 0) {  // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
  // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
    return cid > C
    ? cid & 0xffffff
    : cid
  }

  // 获取stamp
  static getStamp (divisor = 1) {
    return Date.now() / divisor
  }

  static allowCors (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,X-Request-With')

    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  }

  // 处理request请求数据
  static bodyParse (req, res, next) {
    let data = ''
      // 取出请求数据
    req.on('data', chunk => data += chunk) // eslint-disable-line

    req.on('end', () => {
         // 把请求数据放到request对象上的body属性中
      req.body = data
      console.log(req.body)
      if (data) {
        console.log(`[parseBody function] the data is ${req.body}`)
      }
      next()
    })
  }

  // 请求数据parse
  static bodyJSON (req, res, next) {
      const method = req.method
      if(['POST','PUT','PATCH'].indexOf(method) !== -1){

        req.APIINPUT = JSON.parse(req.body)
        next() // 没有这一行，所有接口都会hang住

      }else if(['GET', 'DELETE'].indexOf(method) !== -1){

        req.APIINPUT = req.query
        next() // 没有这一行，所有接口都会hang住
      } else {
        // explain: 'Method not allowed'
        res.json({
          status: 405,
          explain: 'Invalid method'
          // explain: 'Method not allowed'
        })
      }
  }
}

module.exports = Utils
