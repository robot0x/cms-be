const Table = require('./Table')
const Log = require('../utils/Log')

class TagTable extends Table {
  constructor () {
    super('diaodiao_article_tag_name', [
      'tid', // INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'tag id',
      'name', // VARCHAR(32) DEFAULT NULL COMMENT 'tag名称',
      'level', // TINYINT(3) UNSIGNED DEFAULT NULL COMMENT '级别。1-一级分类、2-二级分类',
      'keywords', // VARCHAR(120) DEFAULT NULL COMMENT '',
      'description', // VARCHAR(500) DEFAULT NULL COMMENT '',
      'parent' // INT(10) UNSIGNED DEFAULT NULL COMMENT '',
    ])
  }
  _findByParent (tags, parent) {
    const ret = []
    for (const tag of tags) {
      if (tag.parent === parent) {
        ret.push({ tid: tag.tid, name: tag.name })
      }
    }
    return ret
  }
  getAll () {
    return new Promise((resolve, reject) => {
      super
        .exec(`SELECT tid,name,parent,level FROM ${this.table}`)
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
          resolve(ret)
        })
        .catch(err => {
          Log.exception(err)
          reject(err)
        })
    })
  }
}

module.exports = TagTable
