DROP TABLE IF EXISTS `diaodiao_article_content`;
CREATE TABLE `diaodiao_article_content` (
  -- `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `aid` int(11) unsigned UNIQUE NOT NULL COMMENT '文章id',
  -- `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章markdown格式的数据',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章内容表';
-- CREATE INDEX article_short_id on `article_content` (`aid`)
