DROP TABLE IF EXISTS `diaodiao_article_meta`;
CREATE TABLE `diaodiao_article_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  -- title不做任何处理，内部有换行和空格不要管
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '文章title',
  `share_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享出去的文章的title',
  `wx_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微信的文章的title',
  `wb_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微博的文章的title',
  `ctype` tinyint(1) unsigned DEFAULT 0 COMMENT '文章类型：1-首页/2-好物/3-专刊/4-活动/5-经验/7-值得买/8-评测/9-专题',
  -- timetopublish int(10)
  -- price varchar(32)
  -- buylink varchar(255)
  -- titleex varchar(32)  专刊专用 在专刊上用的 红块标题，比如 "七个好物" "八种经验" 之类的
  -- titlecolor int(32) 专刊专用 指定title的颜色
  `titleex` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '专刊专用。在专刊上显示 七个好物、八种经验之类的',
  `titlecolor` int(32) unsigned DEFAULT 0 COMMENT '专刊专用。用来指定标题颜色',
  `buylink` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享出去的文章的title',
  `timetopublish` int(10) unsigned DEFAULT 0 COMMENT '定时发布。格式是UNIX时间戳',
  `price` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '价格串。形如：越￥360',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '当前文章状态: 0-新增的文章/1-已发布/2-未发布',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
  `user` varchar(60) DEFAULT '' COMMENT '文章被那个用户所创建',
  `lock_by` varchar(60) DEFAULT '' COMMENT '被那个用户锁定',
  `last_update_by` varchar(60) DEFAULT '' COMMENT '最后一次更新的用户',
  `author` varchar(60) DEFAULT '' COMMENT '文章作者姓名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10500 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章meta表';
