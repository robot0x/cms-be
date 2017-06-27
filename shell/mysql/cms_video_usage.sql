DROP TABLE IF EXISTS `cms_video_usage`;
CREATE TABLE `cms_video_usage` (
  `vid` int(10) unsigned NOT NULL COMMENT '视频的id',
  `aid` int(10) unsigned NOT NULL COMMENT '引用视频的文章的id',
  `create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`vid`,`aid`),
  INDEX `aid` (`aid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='PGC视频使用表';