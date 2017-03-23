DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `aid` int(11) unsigned NOT NULL COMMENT '文章的id',
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片url',
  `used` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否被使用。0-未被使用/1-被使用',
  `type` varchar(10) NOT NULL DEFAULT '0' COMMENT '图片的类型。0-没有被使用/1-cover图-封面图/2-thumb图-缩略图/3-banner图/4-文章内容图。存储以逗号隔开的字符串，例如：1,2,4 即这张图片的类型为cover图 & thumb图 & 内容图', -- 12 封面图 缩略图
  `origin_filename` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
  `extension_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
  `size` int unsigned NOT NULL COMMENT '图片尺寸。单位为byte',
  `width` smallint(4) unsigned NOT NULL COMMENT '上传时的原始宽度。单位为px',
  `height` smallint(4) unsigned NOT NULL COMMENT '上传时的原始高度。单位为px',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '图片上传时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

-- CREATE INDEX article_short_id on `image` (`aid`)
