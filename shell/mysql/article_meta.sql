CREATE TABLE `article_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `nid` int(11) unsigned NOT NULL unique COMMENT '文章的短id',
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
  `ctype` tinyint(2) unsigned NOT NULL COMMENT '文章类型',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
  `author` int(11) unsigned COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章作者id',
  `lock_by` int(11) unsigned COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '被那个作者锁定',
  `last_update_by` int(11) unsigned COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
  `data` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';
