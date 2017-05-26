const ArticleService = require('./ArticleService')
const UserService = require('./UserService')
const ImageService = require('./ImageService')
const TagService = require('./TagService')
const AuthorService = require('./AuthorService')
/**
 * 业务类工厂
 *  在server.js中调用
 *  根据不同的请求来初始化相应的业务类
 */
class ServiceFactory {
  constructor (action) {
    this.action = action
  }

  getService () {
    let serviceInstance = null
    switch (this.action) {
      case 'articles':
        serviceInstance = new ArticleService()
        break
      case 'users':
        serviceInstance = new UserService()
        break
      case 'images':
        serviceInstance = new ImageService()
        break
      case 'tags':
        serviceInstance = new TagService()
        break
      case 'authors':
        serviceInstance = new AuthorService()
        break
    }
    return serviceInstance
  }
}

module.exports = ServiceFactory
