-- db sql

DROP TABLE IF EXISTS `t_sub_app_infos`;
CREATE TABLE `t_sub_app_infos` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(64) NOT NULL COMMENT '英文名称，不可重复',
  `app_group_name` varchar(64) NOT NULL COMMENT 'app组名，标识多个app应用是同一种app下不同环境的实例，一个app组允许至多一个正式app存在(测试app不做限制)，用做发布正式服时，拷贝版本信息到正式app',
  `name_in_sec` text default NULL COMMENT '在敏感权限里的系统名字',
  `logo` varchar(255) default '' COMMENT '应用图标',
  `splash_screen` varchar(255) default 'http://mat1.gtimg.com/news/js/tnfe/imgs/leah4/t-fetching.png' COMMENT '载入子应用的过度图',
  `is_test` int NOT NULL COMMENT '是否是测试',
  `enable_build_to_online` int default 1 COMMENT '是否允许流水线直接发布在线版本, 为true时，流水线构建完毕会自动更新online_version',
  `enable_pipeline` int default 1 COMMENT '是否允许流水线发布新版本, true: 蓝盾流水线无编译环境会正常更新build_version, false:流水线构建失败',
  `token` varchar(255) NOT NULL COMMENT 'app token, 用于蓝盾流水线校验app是否合法',
  `cnname` varchar(255) NOT NULL DEFAULT '' COMMENT '中文名称',
  `desc` varchar(255) default '' COMMENT '应用描述',
  `class_name` varchar(255) default '' COMMENT '分类名称, 用作子菜单聚合（此字段已冗余，后续将移除）',
  `class_key` varchar(64) default '' COMMENT '分类key',
  `create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  `online_version` varchar(255) default '' COMMENT '线上版本ID',
  `pre_version` varchar(255) default '' COMMENT '预发布版本ID',
  `test_version` varchar(255) default '' COMMENT '测试版本ID',
  `build_version` varchar(255) default '' COMMENT '构建版本ID',
  `npm_version` varchar(32) DEFAULT '' COMMENT '构建时刻对应的package version值',
  `enable_display` int default 1 COMMENT '是否允许下发给客户端做展示',
  `api_host` varchar(255) default '' COMMENT '请求host',
  `render_mode` varchar(255) default 'react' COMMENT '渲染模式',
  `ui_framework` varchar(255) default 'react' COMMENT 'ui框架',
  `extract_mode` varchar(255) default 'build' COMMENT '插件的提取模式',
  `iframe_src_map` text default NULL COMMENT '正式或者预发布的iframe_src根地址',
  `host_map` text default NULL COMMENT '正式或者预发布环境对应的域名',
  `git_repo_url` varchar(255) default '' COMMENT '项目仓库地址',
  `is_rich` int default 0 COMMENT '是否是富媒体类型应用',
  `is_top` int default 0 COMMENT '是否置顶',
  `is_back_render` int default 0 COMMENT '是否后端渲染',
  `additional_scripts` text default NULL COMMENT '额外添加到head头部的资源',
  `additional_body_scripts` text default NULL COMMENT '额外添加到body头部的资源',
  `is_local_render` int default 0 COMMENT '是否在海拉平台渲染',
  `render_app_host` varchar(255) default '' COMMENT '应用的渲染域名',
  `enable_gray` int default 0 COMMENT '是否开启灰度',
  `is_in_gray` int default 0 COMMENT '是否正在灰度中',
  `owners` text default NULL COMMENT '负责人',
  `gray_users` text default NULL COMMENT '灰度用户名单',
  `proj_ver` varchar(4096) NOT NULL default '{"map":{},utime:0}' COMMENT '项目id和版本号配置',
  `platform` varchar(32) DEFAULT 'hel' COMMENT '平台值',
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='子应用信息';

DROP TABLE IF EXISTS `t_sub_app_version`;
CREATE TABLE `t_sub_app_version` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `sub_app_id` varchar(255) NOT NULL COMMENT '子应用ID',
  `sub_app_name` varchar(255) default '' COMMENT '子应用名称',
  `sub_app_version` varchar(255) NOT NULL COMMENT '用于创建唯一索引的子应用版本号，旧格式xxx_time，新格式 xxx@ver, @scope/xxx@ver',
  `version_tag` varchar(120) NOT NULL COMMENT 'sub_app_version中的版本号字符串',
  `npm_version` varchar(32) DEFAULT '' COMMENT '构建时刻对应的package version值',
  `src_map` text NOT NULL COMMENT '资源文件映射',
  `html_content` text default NULL COMMENT 'index.html内容',
  `create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  `desc` text default NULL COMMENT 'git提交信息',
  `api_host` varchar(255) default '' COMMENT '开发或者测试版本调用api所属域名，不填写的会去读取app.host_map.build',
  `project_name` varchar(255) DEFAULT '' COMMENT 'BK_CI_PROJECT_NAME',
  `pipeline_id` varchar(255) DEFAULT '' COMMENT 'pipeline_id',
  `build_id` varchar(255) DEFAULT '' COMMENT 'pipeline.build.id',
  `git_branch` varchar(255) DEFAULT '' COMMENT 'BK_CI_HOOK_BRANCH',
  `git_hashes` varchar(8192) DEFAULT '' COMMENT 'git_hashes',
  `git_messages` varchar(2048) DEFAULT '' COMMENT 'git_messages',
  `git_repo_url` varchar(255) DEFAULT '' COMMENT 'BK_CI_GIT_REPO_URL',
  `ext` varchar(8192) DEFAULT '' COMMENT '用户自定义的扩展数据',
  `plugin_ver` varchar(255) DEFAULT '' COMMENT '插件版本',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sub_app_version` (`sub_app_version`),
  KEY `idx_sub_app_name` (`sub_app_name`),
  KEY `idx_create_by` (`create_by`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='子应用版本信息';


DROP TABLE IF EXISTS `t_upload_cos_log`;
CREATE TABLE `t_upload_cos_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `app_name` varchar(255) NOT NULL COMMENT '冗余存储app名称',
  `app_version` varchar(255) default '' COMMENT '对应的app版本',
  `file_web_path` text default NULL COMMENT '文件的网络路径',
  `upload_result` text default NULL COMMENT 'cos上传返回结果',
  `upload_spend_time` varchar(255) DEFAULT NULL COMMENT 'cos上传耗时',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='上传cos的log日志';

DROP TABLE IF EXISTS `t_api_trpc_log`;
CREATE TABLE `t_api_trpc_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `trpc_name` varchar(255) NOT NULL COMMENT '北极星名字',
  `env` varchar(255) NOT NULL COMMENT '环境',
	`path` varchar(255) NOT NULL COMMENT '请求的路径',
  `use_time` int NOT NULL COMMENT '请求耗时',
	`create_by` varchar(255) DEFAULT NULL COMMENT '创建人',
	`create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='trpc转发记录';

DROP TABLE IF EXISTS `t_user_extend`;
CREATE TABLE `t_user_extend` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `rtx_name` varchar(255) NOT NULL DEFAULT '' COMMENT '用户rtx名称',
  `extend_info` varchar(5096) NOT NULL DEFAULT '{"createAppLimit":20,"createClassLimit":10}' COMMENT '扩展信息',
	`star_info` varchar(5096) NOT NULL DEFAULT '{"appNames":[]}' COMMENT '标星记录',
  `visit_info` varchar(5096) NOT NULL DEFAULT '{"appNames":[]}' COMMENT '访问记录',
  `mark_info` text NOT NULL COMMENT '标注记录 {"markedList":[]}',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='用户扩展信息';

-- 组织分类信息表
DROP TABLE IF EXISTS `t_class_info`;
CREATE TABLE `t_class_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `class_key` varchar(64) NOT NULL DEFAULT '' '组织分类key，对应t_sub_app_infos.class_key',
  `class_label` varchar(128) NOT NULL DEFAULT '' COMMENT '组织分类的名称，对应t_sub_app_infos.class_name',
  `class_token` varchar(64) NOT NULL DEFAULT '' COMMENT '组织分类的授权token，可用于帮助openapi调用时计算签名',
  `create_app_limit` int default 50 NOT NULL COMMENT 'oepnapi创建应用的上限数量',
  `enable_openapi` int default 0 COMMENT '是否允许openapi调用，需要向管理申请开启此设置后才能使用openapi',
  `create_by` varchar(255) DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) DEFAULT '' COMMENT '更新人',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新的时间',
  UNIQUE (`class_key`),
  UNIQUE (`class_label`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='组织分类信息';

DROP TABLE IF EXISTS `t_track`;
CREATE TABLE `t_track` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `schema_id` varchar(255) NOT NULL DEFAULT '' COMMENT '表名',
  `update_json` varchar(5096) NOT NULL DEFAULT '{}' COMMENT '更新的json体',
  `operator` varchar(255) NOT NULL DEFAULT '' COMMENT '操作者',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='操作轨迹';

DROP TABLE IF EXISTS `t_sub_app_global`;
CREATE TABLE `t_sub_app_global` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(64) NOT NULL COMMENT '应用英文名',
  `mark_info` varchar(10192) NOT NULL DEFAULT '{"markedList":[]}' COMMENT '应用的公共标注记录',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新的时间',
  UNIQUE (`name`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='应用公共数据';

DROP TABLE IF EXISTS `t_allowed_app`;
CREATE TABLE `t_allowed_app` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `data` mediumtext NOT NULL COMMENT '白名单列表 {"apps":[]}',
  `create_by` varchar(255) DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) DEFAULT '' COMMENT '更新人',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='可以外网访问的白名单列表';

DROP TABLE IF EXISTS `t_stat`;
CREATE TABLE `t_stat` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `type` varchar(128) DEFAULT '' COMMENT '统计类型',
  `sub_type` varchar(128) DEFAULT '' COMMENT '统计子类型',
  `time_label` varchar(64) DEFAULT '' COMMENT '时间标签 20240101',
  `env_label` varchar(128) DEFAULT '' COMMENT '环境标签(123环境值) formal',
  `data` mediumtext NOT NULL COMMENT '统计数据 {}',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='站点统计相关，由t_stat_dist汇总而得';

DROP TABLE IF EXISTS `t_stat_dist`;
CREATE TABLE `t_stat_dist` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `type` varchar(128) DEFAULT '' COMMENT '统计类型',
  `sub_type` varchar(128) DEFAULT '' COMMENT '统计子类型',
  `env_label` varchar(128) DEFAULT '' COMMENT '环境标签(123环境值) formal',
  `dist_env_label` varchar(128) DEFAULT '' COMMENT '环境标签(123环境值-容器名字-workerId) formal-xxx-0',
  `time_label` varchar(64) DEFAULT '' COMMENT '时间标签 20240101',
  `data` mediumtext NOT NULL COMMENT '统计数据 {}',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='站点统计相关(各个实例)';

DROP TABLE IF EXISTS `t_hmn_stat`;
CREATE TABLE `t_hmn_stat` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `env_name` varchar(32) DEFAULT '' COMMENT '环境名称',
  `mod_name` varchar(64) DEFAULT '' COMMENT 'hel模块名',
  `mod_version` varchar(64) DEFAULT '' COMMENT 'hel模块版本',
  `img_version` varchar(256) DEFAULT '' COMMENT '镜像名',
  `container_name` varchar(128) DEFAULT '' COMMENT '容器名',
  `container_ip` varchar(32) DEFAULT '' COMMENT '容器ip',
  `pod_name` varchar(64) DEFAULT '' COMMENT '容器pod名',
  `city` varchar(32) DEFAULT '' COMMENT '城市代号',
  `extra` varchar(10192) DEFAULT '' COMMENT '其他额外数据',
  `load_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '模块载入时间',
  `load_mode` varchar(12) DEFAULT '' COMMENT '载入方式',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  PRIMARY KEY (`id`),
  INDEX (`mod_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='hel服务端模块统计相关';

DROP TABLE IF EXISTS `t_hmn_stat_log`;
CREATE TABLE `t_hmn_stat_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `env_name` varchar(32) DEFAULT '' COMMENT '环境名称',
  `mod_name` varchar(64) DEFAULT '' COMMENT 'hel模块名',
  `mod_version` varchar(64) DEFAULT '' COMMENT 'hel模块版本',
  `img_version` varchar(256) DEFAULT '' COMMENT '镜像名',
  `container_name` varchar(128) DEFAULT '' COMMENT '容器名',
  `container_ip` varchar(32) DEFAULT '' COMMENT '容器ip',
  `pod_name` varchar(64) DEFAULT '' COMMENT '容器pod名',
  `city` varchar(32) DEFAULT '' COMMENT '城市代号',
  `extra` varchar(10192) DEFAULT '' COMMENT '其他额外数据',
  `load_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '模块载入时间',
  `load_mode` varchar(12) DEFAULT '' COMMENT '载入方式',
  `end_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '模块结束时间',
  `end_reason` varchar(12) DEFAULT '' COMMENT '结束原因',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建的时间',
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改的时间',
  PRIMARY KEY (`id`),
  INDEX (`mod_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='hel服务端模块统计相关日志';
