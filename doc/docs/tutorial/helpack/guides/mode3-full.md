---
sidebar_position: 4
---

# 完整模式

## 说明

这是完整的生产模式，需要配置 MySQL 和 Redis，提供完整的模块管理、版本管理、用户管理等功能。

## 适用场景

- 生产环境
- 需要完整的模块管理功能
- 需要持久化存储
- 需要用户权限管理

## 启动步骤

### 1. 配置 MySQL

#### 创建数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE server CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 执行初始化脚本

```bash
# 执行初始化脚本
mysql -u root -p server < server/db.sql
```

#### 修改数据库配置

修改 `server/src/at/configs/env/index.ts` 中的数据库配置：

```typescript
dbConf: {
  username: 'root',
  password: 'your_password',
  database: 'server',
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
}
```

### 2. 配置 Redis

#### 启动 Redis 服务

```bash
redis-server
```

#### 修改 Redis 配置

修改 `server/src/at/configs/env/index.ts` 中的 Redis 配置：

```typescript
redisConf: {
  ip: '127.0.0.1',
  port: 6379,
  password: '',  // 如果有密码，填写密码
  keyPrefix: 'xc_',
}
```

### 3. 启动后端（完整模式）

```bash
cd server
npm install
npm run build
npm run start
```

确保环境变量 `IS_SIMPLE_SERVER=0`（默认值），后端会连接数据库和 Redis。

**注意：** 如果要连接数据库和 Redis，需要设置 `IS_LOCAL_MODE=false`：

```bash
# Windows
set IS_LOCAL_MODE=false
npm run start

# Linux/Mac
IS_LOCAL_MODE=false npm run start
```

### 4. 启动用户端

```bash
cd hm-node-user
npm run build 
npm run start
```

用户端会在 `http://localhost:7776` 启动。、


### 5. 访问用户端界面

打开浏览器访问 `http://localhost:7776`，即可模拟用户的使用界面。

![](/img/user端截图.png)


### 6. 访问后端界面

打开浏览器访问 `http://localhost:7777`，即可进入helpack管理界面。

![](https://tnfe.gtimg.com/hel-img/WX20251027-120047.png)


## 完整功能

- ✅ 模块发布和管理
- ✅ 版本管理和切换
- ✅ 用户权限管理
- ✅ 数据持久化存储
- ✅ 缓存管理
- ✅ 完整的 API 功能

## 环境变量配置

如果需要修改环境变量，可以在启动时设置：

```bash
# Windows
set IS_LOCAL_MODE=false
set IS_SIMPLE_SERVER=0
npm run start

# Linux/Mac
IS_LOCAL_MODE=false IS_SIMPLE_SERVER=0 npm run start
```

或者创建 `.env.js` 文件（已加入 `.gitignore`）进行本地配置。

## 技术细节

- 后端运行在完整模式（`IS_SIMPLE_SERVER=0`）
- `IS_LOCAL_MODE=false`，会连接数据库和 Redis
- 支持所有功能，包括数据持久化
- 适合生产环境使用

