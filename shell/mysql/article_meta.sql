CREATE TABLE `article_meta` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `cid` int(10) unsigned NOT NULL COMMENT '文章的id',
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
  `ctype` tinyint(2) unsigned COMMENT '文章类型',
  `create_time` timestamp(0) NOT NULL COMMENT '商品创建时间',
  `last_update_time` timestamp(0) NOT NULL COMMENT '商品最后更新时间',
  `author` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章作者id',
  `lock_by` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
  `last_update_by` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
  `data` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';
