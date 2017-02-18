DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '作者自增id',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL unique COMMENT '帐号',
  `password` varchar(20) NOT NULL COMMENT '密码',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '作者类型，0-管理员/1-有调编辑/2-外部编辑，用来做权限控制',
  `online` tinyint(1) unsigned NOT NULL COMMENT '是否在线，0-不在线/1-在线',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `data` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '冗余字段',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作者表';

CREATE INDEX article_short_id on `user` (`register_time`,`online`)
