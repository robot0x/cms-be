const Table = require('./Table')
const log4js = require('log4js')
const logger = log4js.getLogger()

class TagTable extends Table{
  constructor(){
    super('article_tag_name', [
      'tid', // INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'tag id',
      'name', // VARCHAR(32) DEFAULT NULL COMMENT 'tag名称',
      'level', // TINYINT(3) UNSIGNED DEFAULT NULL COMMENT '级别。1-一级分类、2-二级分类',
      'keywords', // VARCHAR(120) DEFAULT NULL COMMENT '',
      'description', // VARCHAR(500) DEFAULT NULL COMMENT '',
      'parent' // INT(10) UNSIGNED DEFAULT NULL COMMENT '',
    ])
  }
  _findByParent (tags, parent){
    const ret = []
    for(const tag of tags){
      if(tag.parent === parent){
        ret.push({
          tid: tag.tid,
          name: tag.name
        })
      }
    }
    return ret
  }
  getAll () {
    return new Promise((resolve, reject) => {
      super.exec(`SELECT tid,name,parent,level FROM ${this.table}`)
      .then(result => {
        // logger.info('TagTable 21', result)
        // resolve(result)
        const ret = []
        const res = [...result]
        result.filter(tag => tag.level === 1).map(tag => {
          ret.push({
            tid: tag.tid,
            name: tag.name,
            children: this._findByParent(res, tag.tid)
          })
        })

        // for(let i = 0, l = result.length; i < l; i++){
        //   const tag = result[i]
        //   const newTag = {}
        //   if(tag.level ===  1){
        //     newTag.tid = tag.tid
        //     newTag.name = tag.name
        //     newTag.children = this._findByParent(result, tag.tid)
        //   }
        // }

        resolve(ret)
      })
      .catch(err => {
        console.log(err);
        reject(err.message)
      })
    })
  }

}

module.exports = TagTable
