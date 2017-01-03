const ArticleMetaTable = require('../db/ArticleMetaTable')
const ArticleContentTable = require('../db/ArticleContentTable')
const _ = require('lodash')
const articleMetaTable = new ArticleMetaTable()
const articleContentTable = new ArticleContentTable()

class ArticlesService{

  constructor(){
    console.log('ArticlesService 实例化了....')
  }

  save(param){
    console.log('ArticlesService save...', param)
    const meta = {
      
    }
  }

  delete(param){
    const nid = param.id

    console.log('ArticlesService delete...', param)
  }

  update(param, patch = false){
    console.log('ArticlesService update...', param)
  }

  list(param){
    console.log('ArticlesService list...', param)
    const type = param.type
    return new Promise((resolve, reject) => {
      if( type === 'content' ) {
        articleContentTable
        .list(param.id, param.limit)
        .then(rows => {
          resolve(rows)
        })
        .catch(err => {
          reject(err)
          console.log(err)
        })
      } else {
        articleMetaTable
        .list(param.id, param.limit)
        .then(rows => {
          resolve(rows)
        })
        .catch(err => {
          reject(err)
          console.log(err)
        })
      }
    })
  }
}

module.exports = ArticlesService
