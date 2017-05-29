DROP TABLE IF EXISTS `diaodiao_article_gift_hint`;
CREATE TABLE `diaodiao_article_gift_hint` (
  `aid` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '文章id',
  `used_for_search` TINYINT(4) DEFAULT '0' COMMENT '是否适合送礼，0-不适合；1-适合',
  `hints` text COMMENT '说明' COMMENT '{"character": "", "relation": "5 6 7", "scene": "1 2 "}',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼物表';
-- 指定文章是否适合送礼
-- 每个送礼条目是在页面写死的，在代码层面进行的解释
