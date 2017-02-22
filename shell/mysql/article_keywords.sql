DROP TABLE IF EXISTS `article_keywords`;
CREATE TABLE `article_keywords` (
  `aid` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '文章id',
  `used_for_search` TINYINT(4) DEFAULT '1' COMMENT '是否能被搜索，0-不能；1-能',
  `keywords` text COMMENT '关键词' COMMENT '{category: "航空 飞行", brand: "东方航空 中国国航 海南航空", similar: "常旅客 航空公司", scene: "兑换", special: ""}',
  KEY `used_for_search` (`used_for_search`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章keywords表';
-- 文章打keywords需要用到此表 http://115.28.38.122:8087/tag_edit
-- category-品类 brand-品牌 scene-使用场景 similar-类似产品 special-特殊搜索
