const Table = require('./Table')

class ImageTable extends Table{
  constructor(){
    super('image', [
      `id`, // bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      `aid`, // int(11) unsigned NOT NULL COMMENT '文章的id',
      `url`, // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片url',
      `used`, // tinyint(1) unsigned NOT NULL COMMENT '是否被使用。0-未被使用，1-被使用',
      `type`, // tinyint(2) unsigned NOT NULL COMMENT '图片的类型。1-cover图-封面图/2-thumb图-缩略图/3-banner图/4-文章内容图',
      `origin_filename`, // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
      `extension_name`, // varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
      `size`, // int unsigned NOT NULL COMMENT '图片尺寸。单位为byte',,
      `width`, // smallint(4) unsigned NOT NULL COMMENT '上传时的原始宽度，单位为px',
      `height`, // smallint(4) unsigned NOT NULL COMMENT '上传时的原始高度，单位为px',
      `create_time` // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '图片上传时间',
    ])
  }
  exec(sql, data){
    return super.exec(sql, data)
  }
  // getByUrl (url) {
  //     return super.getByCond(`url = ${url}`)
  // }
  // deleteByUrl (url) {
  //     return super.deleteByCond(`url = ${url}`)
  // }

}

module.exports = ImageTable
