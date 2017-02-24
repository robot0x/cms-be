DROP TABLE IF EXISTS `article_tag_name`;
CREATE TABLE `article_tag_name` (
  `tid` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'tag id',
  `name` VARCHAR(32) DEFAULT NULL COMMENT 'tag名称',
  `level` TINYINT(3) UNSIGNED DEFAULT NULL COMMENT '级别。1-一级分类、2-二级分类',
  `keywords` VARCHAR(120) DEFAULT NULL COMMENT '',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '',
  `parent` INT(10) UNSIGNED DEFAULT NULL COMMENT '',
  PRIMARY KEY(`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='tag表';