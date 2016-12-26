class ArticleContentTable {

  static get columns () {
    return [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      'nid', // int(11) unsigned NOT NULL COMMENT '文章id',
      'content', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
      'data' // text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
    ]
  }

  static getById (id) {

  }

  static getByNid (nid) {

  }

  static getByCond (cond) {

  }

  static update (article, cond) {

  }

  static save (aritcle) {

  }

  static deleteById (id) {

  }

  static deleteByName (name) {

  }

  static deleteByCond (cond) {

  }

}

module.exports = ArticleContentTable
