const Table = require('./Table')

class ArticleContentTable extends Table {
  constructor () {
    super('diaodiao_article_content', [
      // 'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      'aid', // int(11) unsigned NOT NULL COMMENT '文章id',
      'content' // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
    ])
  }
  exec (sql, data) {
    return super.exec(sql, data)
  }
}

module.exports = ArticleContentTable
