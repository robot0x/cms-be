DROP TABLE IF EXISTS `diaodiao_article_image`;
CREATE TABLE `diaodiao_article_image` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `aid` int(11) unsigned NOT NULL COMMENT '文章的id',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '图片url',
  `used` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否被使用。0-未被使用/1-被使用',
  -- banner feedlist用的扁图
  -- swipe  轮播图
  -- coverex图
  -- type 改为bit位
  `type` smallint unsigned COMMENT '图片的类型。''0未设置类型（没有被使用/第1位-内容图(1)/第2位cover图(2)/第3位coverex图(4)/第4位thumb图(8)/第5位swipe图(16)/第6位banner图(32)', -- 12 封面图 缩略图
  `origin_filename` varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
  `extension_name` varchar(10) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
  `size` int unsigned NOT NULL DEFAULT 0 COMMENT '图片尺寸。单位为byte',
  `width` smallint(4) unsigned NOT NULL DEFAULT 0 COMMENT '上传时的原始宽度。单位为px',
  `height` smallint(4) unsigned NOT NULL DEFAULT 0 COMMENT '上传时的原始高度。单位为px',
  `alt` varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'img的alt属性',
  `title` varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'img的title属性',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '图片上传时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

-- CREATE INDEX article_short_id on `image` (`aid`)
