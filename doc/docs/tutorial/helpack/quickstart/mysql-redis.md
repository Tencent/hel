---
sidebar_position: 3
---

# 后端数据库配置

Helpack 支持三种运行模式：
- **Simple 模式**：无需数据库和 Redis，仅提供基础 API
- **Local 模式**：无需数据库和 Redis，采用本地模拟数据
- **完整模式**：需要配置 MySQL 和 Redis，完整生产环境

## MySQL 配置

### 配置文件位置

在 `server/src/at/configs/env/index.ts` 中配置数据库连接：

```typescript
dbConf: {
  username: 'root',        // 数据库用户名
  password: '123456',      // 数据库密码
  database: 'server',      // 数据库名称
  host: 'localhost',       // 数据库主机
  port: '3306',            // 数据库端口
  dialect: 'mysql',
}
```

### 初始化数据库

执行数据库初始化脚本：

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE server CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 执行初始化脚本
mysql -u root -p server < server/db.sql
```

## Redis 配置

### 配置文件位置

在 `server/src/at/configs/env/index.ts` 中配置 Redis 连接：

```typescript
redisConf: {
  ip: '127.0.0.1',         // Redis 主机
  port: 6379,              // Redis 端口
  password: '',            // Redis 密码（如果有）
  keyPrefix: 'xc_',        // Key 前缀
}
```

### 启动 Redis

确保 Redis 服务已启动：

```bash
# 启动 Redis 服务
redis-server
```

## 注意事项

- 如果使用 Simple 模式和 Local 模式，可以跳过 MySQL 和 Redis 配置
- 完整模式需要同时配置 MySQL 和 Redis

