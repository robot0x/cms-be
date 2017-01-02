const API = require('../config/api')
const ArticlesService = require('./ArticlesService')
const AuthorsService = require('./AuthorsService')
const ImagesService = require('./ImagesService');

class ServiceFactory{
  constructor(action){
    this.action = action
  }

  getService(){
    let serviceInstance = null
    console.log('------------' + this.action );
    switch (this.action) {
      case 'articles':
        serviceInstance = new ArticlesService()
        break;
      case 'authors':
        serviceInstance = new AuthorsService()
        break;
      case 'images':
        serviceInstance = new ImagesService()
        break;
    }
    // console.log(serviceInstance);
    return serviceInstance
  }

}


module.exports = ServiceFactory
