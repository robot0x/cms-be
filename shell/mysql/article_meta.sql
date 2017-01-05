DROP TABLE IF EXISTS `article_meta`;
CREATE TABLE `article_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `nid` int(11) unsigned NOT NULL unique COMMENT '文章短id',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
  `ctype` tinyint(1) unsigned NOT NULL COMMENT '文章类型',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '当前文章状态: 0-未发布/1-已发布，暂时还用不带该字段',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
  `author` int(11) unsigned NOT NULL COMMENT '文章作者id',
  `lock_by` int(11) unsigned DEFAULT 0 COMMENT '被那个作者锁定',
  `last_update_by` int(11) unsigned NOT NULL COMMENT '被那个作者锁定',
  `data` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';

CREATE INDEX article_short_id on `article_meta` (`nid`)
