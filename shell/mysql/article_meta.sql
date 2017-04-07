DROP TABLE IF EXISTS `article_meta`;
CREATE TABLE `article_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '文章title',
  `share_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享出去的文章的title',
  `wx_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微信的文章的title',
  `wb_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微博的文章的title',
  `ctype` tinyint(1) unsigned DEFAULT 0 COMMENT '文章类型',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '当前文章状态: 0-新增的文章/1-已发布/2-未发布',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
  `user` varchar(60)  DEFAULT '' COMMENT '文章被那个用户所创建',
  `lock_by` varchar(60) DEFAULT '' COMMENT '被那个用户锁定',
  `last_update_by` varchar(60) DEFAULT '' COMMENT '最后一次更新的用户',
  `author` varchar(60) DEFAULT '' COMMENT '文章作者姓名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';
