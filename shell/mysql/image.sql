CREATE TABLE `image` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `cid` int(10) unsigned NOT NULL COMMENT '文章的id',
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片url',
  `type` tinyint(2) COMMENT '图片的类型。1-cover图-封面图/2-thumb图-缩略图/3-banner图/4-文章内容图',
  `origin_filename` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
  `extension_name` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
  `width` smallint(4) unsigned COMMENT '上传时的原始宽度，单位为px',
  `height` smallint(4) unsigned COMMENT '上传时的原始高度，单位为px',
  `create_time` timestamp(0) NOT NULL COMMENT '图片上传时间',
  `last_update_by` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
  `data` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';
