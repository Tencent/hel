# create-hel 项目说明

## 项目简介

create-hel 是一个基于快速创建 hel 项目的命令行工具，自带多种模板，目前支持创建 hel + react + pnpm workspace 的`hel-mono`大仓架构项目，以及其他 hel 独立的示例项目

## 主要功能

- 支持快速创建微模块大仓架构项目（来自模板`hel-mono-react`）
- 支持创建独立的 react、vue、js 库等传统微模块项目

## 目录结构

```
create-hel/
  ├── bin/                  # 项目脚本
  │   ├── analyze-args      # 分析命令行参数
  │   ├── config            # 项目脚本配置
  │   ├── fetch-template    # 拉取模板
  │   ├── create-template   # 创建模板
  │   ├── util              # 工具函数
  ├── package.json          # 根包配置
  └── README.md             # 项目说明文档
```

## 快速开始

### 创建 hel-mono 项目

以下多种方式均可创建 hel-mono 项目，任意选择其一即可

> 注：如不提供项目目录名称，则会提供交互询问方式要求用户输入

- npx

使用 npx 创建项目到`my-mono`目录下

```bash
npx create-hel my-mono
```

- create-hel-mono

使用 npm 全局安装 `create-hel` 后，再基于`hel`命令行或`create-hel`命令行创建项目到`my-mono`目录下

```bash
npm install create-hel -g
# or type as: create-hel my-mono
hel my-mono
```

- npm create

使用 npm 创建项目到`my-mono`目录下

```bash
npm create hel@latest my-mono
```

- pnpm create

使用 pnpm 创建项目到`my-mono`目录下

```bash
pnpm create hel my-mono
```

### 安装依赖并启动

确保 node 版本>=18，按照提示进入项目安装依赖并启动

```bash
cd <your-project-name>
pnpm install
pnpm start
```

针对内置模板`react`, 有 2 种启动方式

- 普通模式启动

```bash
pnpm start
```

- 微模块启动

```bash
# 初始化微模块相关代码
pnpm start .init
# 启动子模块
pnpm start mono-comps
# 启动宿主
pnpm start
```

更多说明详见 `react` 模板 `README.md` 文件。

### 参数说明

- -t 可选参数 `-t`（或 `--template`） 默认值`react`，表示模板类型，目前暂只支持设定为(`react`)。

```bash
npm create hel my-mono -t react
```

- -r 可选参数 `-r`（或 `--remote`）默认值 false，表示是否优先从远端拉取 t 参数对应的模板

```bash
npm create hel my-mono -t react -r
```

- -u 可选参数 `-u`（或 `--url`）默认值 undefined，表示从指定 url 的拉取远端模板（设置了 u，则 t r 无效）

```bash
npm create hel my-mono -u https://github.com/hel-eco/hel-mono
```

## 其他

### 携带参数写法

npm create 带参写法如下，需要加 `--`，在其后面的参数会被 `create-hel` cli 工具接收到

```bash
npm create hel -- -t xx-template
```

### 贡献模板

在 https://github.com/hel-eco 组下创建 `hel-mono-` 前缀的项目，均能被 cli 识别到，例如创一个 `hel-mono-my-type`，则可以使用以下命令行安装

```bash
# 安装 https://github.com/hel-eco/hel-mono-my-type 项目
create-hel -t my-type
```

### 定制 cli

透传`config`参数，基于 `create-hel` 构建自己的专属 hel-mono cli

```js
#!/usr/bin/env node
const config = require('./config');
const { analyzeArgs, setConfig } = require('create-hel');

// config 参数见 setConfig 里的类型说明
setConfig(config);
analyzeArgs();
```
