DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `nid` int(11) unsigned NOT NULL COMMENT '文章的id',
  `url` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片url',
  `type` tinyint(1) unsigned NOT NULL COMMENT '图片的类型。1-cover图-封面图/2-thumb图-缩略图/3-banner图/4-文章内容图',
  `origin_filename` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
  `extension_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
  `width` smallint(4) unsigned NOT NULL COMMENT '上传时的原始宽度，单位为px',
  `height` smallint(4) unsigned NOT NULL COMMENT '上传时的原始高度，单位为px',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '图片上传时间',
  `data` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '冗余字段',
  PRIMARY KEY (`id`, `nid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

CREATE INDEX article_short_id on `image` (`nid`)
