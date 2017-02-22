DROP TABLE IF EXISTS `article_tag_index`;
CREATE TABLE `article_tag_index` (
  `aid` INT(10) UNSIGNED NOT NULL COMMENT '文章id',
  `tag1` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '一级tag',
  `tag2` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '二级tag',
  `tag3` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '三级tag，目前还没使用',
  `tag_version` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '目前没有使用该字段',
  PRIMARY KEY (`aid`,`tag_version`,`tag1`,`tag2`,`tag3`),
          KEY `tag1` (`tag1`),
          KEY `tag2` (`tag2`),
          KEY `tag3` (`tag3`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章与tag关系表';
