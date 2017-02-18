const ArticlesService = require('./ArticlesService')
const UsersService = require('./UsersService')
const ImagesService = require('./ImagesService')
/**
 * 业务类工厂
 *  在server.js中调用
 *  根据不同的请求来初始化相应的业务类
 */
class ServiceFactory {

  constructor(action) {
    this.action = action
  }

  getService() {
    let serviceInstance = null
    switch (this.action) {
      case 'articles':
        serviceInstance = new ArticlesService()
        break;
      case 'authors':
        serviceInstance = new UsersService()
        break;
      case 'images':
        serviceInstance = new ImagesService()
        break;
    }
    return serviceInstance
  }

}


module.exports = ServiceFactory
