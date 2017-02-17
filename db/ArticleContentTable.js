const Table = require('./Table')

class ArticleContentTable extends Table {
  constructor() {
    super('article_content',
    [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      'nid', // int(11) unsigned NOT NULL COMMENT '文章id',
      'content', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
      // 'data' // text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
    ])
  }
}

module.exports = ArticleContentTable
