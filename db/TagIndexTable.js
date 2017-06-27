const Table = require('./Table')

class TagIndexTable extends Table {
  constructor () {
    super('diaodiao_article_tag_index', [
      'aid', // INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'tag id',
      'tag1', // VARCHAR(32) DEFAULT NULL COMMENT 'tag名称',
      'tag2'
    ])
  }
  getById (id) {
    return new Promise((resolve, reject) => {
      resolve(this.exec(`SELECT ${this.columnsStr} FROM ${this.table} WHERE aid = ${id} AND tag1 <> 'page_type'`))
    })
  }
}

module.exports = TagIndexTable

// const tit = new TagIndexTable()
// tit.getById(1).then(data => {
//   console.log(data)
// })
