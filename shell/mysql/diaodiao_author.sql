DROP TABLE IF EXISTS `diaodiao_author`;
CREATE TABLE `diaodiao_author` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'internal id',
  `source` varchar(64) NOT NULL COMMENT 'key, same as in cms *_field_source',
  `pic_uri` varchar(256) NOT NULL COMMENT 'full path to img, no host',
  `title` varchar(64) NOT NULL COMMENT 'source''s display title',
  `intro` varchar(256) NOT NULL COMMENT 'source''s intro text',
  `type` varchar(16) NOT NULL COMMENT 'source''s type: wechat/www/author/...',
  `link` varchar(64) DEFAULT NULL COMMENT 'domain/host of a www type source',
  `naming` varchar(64) DEFAULT NULL COMMENT 'chinese version of type? 网站/微信号/调调编辑',
  `value` varchar(64) NOT NULL COMMENT 'text shown in gray, under title',
  `brief` varchar(32) DEFAULT NULL COMMENT 'brief of source, record only',
  PRIMARY KEY (`id`),
  UNIQUE KEY `source` (`source`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Stores author infomation.';
