DROP TABLE IF EXISTS `article_content`;
CREATE TABLE `article_content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `nid` int(11) unsigned NOT NULL COMMENT '文章短id',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
  `data` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章内容表';

CREATE INDEX article_short_id on `article_content` (`nid`)
