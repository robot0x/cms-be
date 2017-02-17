const Table = require('./Table')

class ArticleMetaTable extends Table {

  constructor() {
    super('article_meta', [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      'nid', // int(11) unsigned NOT NULL unique COMMENT '文章的短id',
      'title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'share_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wx_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wb_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'ctype', // tinyint(2) unsigned NOT NULL COMMENT '文章类型',
      'create_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
      'last_update_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
      'author', // int(11) unsigned COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章作者id',
      'lock_by', // int(11) unsigned COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '被那个作者锁定',
      'last_update_by', // int(11) unsigned COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
      // 'data' // text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
    ])
  }

  getByTitle (title) {
    return super.getByCond(`title = ${title}`)
  }

  deleteByName (name) {
    return super.deleteByCond(`name = ${name}`)
  }

  save(data){
    // 新增时，如果没有指定 lock_by 和 last_update_by，则默认这两个字段和 author 一样
    const author = data.author
    const lock_by = data.lock_by
    const last_update_by = data.last_update_by
    if(!lock_by){
      data.lock_by = author
    }
    if(!last_update_by){
      data.last_update_by = author
    }
    return super.save(data)
  }

}

module.exports = ArticleMetaTable
