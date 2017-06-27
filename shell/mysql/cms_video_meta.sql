DROP TABLE IF EXISTS `cms_video_meta`;
CREATE TABLE `cms_video_meta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'key，内部编号',
  `vidstat` varchar(8) DEFAULT NULL COMMENT '状态串，视频本体的上传/转码/ready/删除.. 可能是来自阿里系统的返回值 + 我们自己的管理状态值 这么多可能',
  `vidprocessid` char(128) DEFAULT NULL COMMENT '视频转码的job id',
  `picstat` varchar(8) DEFAULT NULL COMMENT '状态串，视频截图的 start/processing/ready..',    
  `picprocessid` char(128) DEFAULT NULL COMMENT '视频截图的job id',
  `vidurl` varchar(256) DEFAULT NULL COMMENT '视频最终的url，命名可能需要上传时通过业务来强制，系统不随机生成xxx.mp4名',
  `picurl` varchar(256) DEFAULT NULL COMMENT '截图的最终url，自己传的截图也是可能的',
  `size` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '视频的尺寸，bytes',
  `desc` varchar(128) DEFAULT NULL COMMENT '对视频的描述，要有意义，对检索有帮助',
  `specs` text DEFAULT NULL COMMENT '其他视频描述信息，如格式/容器/编码版本/...',
  `create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `lastmod` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `author` int(10) NOT NULL COMMENT '外键，CMS作者谁创建的',
  PRIMARY KEY (`id`),
  INDEX `vidstat` (`vidstat`),`
  INDEX `picstat` (`picstat`),
  INDEX `person` (`author`),
  INDEX `create` (`create`),
  INDEX `lastmod` (`lastmod`),
  INDEX `desc` (`desc`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='PGC视频管理表';