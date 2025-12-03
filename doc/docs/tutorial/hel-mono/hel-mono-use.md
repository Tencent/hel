---
sidebar_position: 2
---

# Hel-Mono 使用说明

## 概述
本文档介绍使用 hel 命令行工具管理 monorepo 项目的完整流程，包括项目初始化、包创建、构建和发布。

## 环境要求
- Node.js
- pnpm
- hel 命令行工具

## 操作流程

### 1. 初始化项目
使用 hel 命令行工具初始化一个新的 monorepo 项目：

```bash
hel init my-hel
```

此命令会创建一个名为 `my-hel` 的新项目，包含 monorepo 的基本目录结构。

### 2. 创建新包
进入项目目录，在 `packages` 文件夹下创建新的包：

```bash
# 进入项目目录
cd my-hel

# 创建新包（不指定包名）
pnpm start .create-mod my-lib

# 或者创建新包并指定包名
pnpm start .create-mod my-lib -n @my-demo/lib
```

**参数说明：**
- `my-lib`: 包目录名称
- `-n @my-demo/lib`: 指定包的正式名称（可选）

### 3. 开发与构建

#### 修改代码
进入新创建的包目录进行代码开发：
```bash
cd packages/my-lib
```

修改包中的源代码文件，并更新 `package.json` 中的版本号。

#### 执行构建
在项目根目录下执行构建命令：
```bash
pnpm start build:nbsm
```

此命令会编译包代码，生成可发布的构建文件。

### 4. 发布包
执行发布命令将包发布到 npm 仓库：

```bash
pnpm publish --no-git-checks
```

**参数说明：**
- `--no-git-checks`: 跳过 git 检查，确保发布过程不受 git 状态影响

## 注意事项
1. 确保在发布前已正确配置 npm 账号和认证信息
2. 每次发布前需要更新包版本号
3. 建议在发布前进行充分的测试
4. 如果包名为 scoped 包（如 `@my-demo/lib`），需要确保有相应的发布权限