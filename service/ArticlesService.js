const ArticleMetaTable = require('../db/ArticleMetaTable')
const ArticleContentTable = require('../db/ArticleContentTable')

class ArticlesService{
  constructor(){
    console.log('ArticlesService 实例化....');
  }
  save(param){
    console.log('ArticlesService save...', param);
    const meta = {

    }


  }
  delete(param){
    const nid = param.id

    console.log('ArticlesService delete...', param);
  }
  update(param, patch = false){
    console.log('ArticlesService update...', param);
  }
  list(param){
    console.log('ArticlesService list...', param);
    ArticleContentTable.getAll().then((rows) => {
      console.log('-----------asdsa--------------');
      console.log(rows);
    })
  }
}

module.exports = ArticlesService
