## Helpack
[Hel Pack](https://your-deployed-helpack-site.com)，海拉HelPack，动态化模块发布、托管服务

![](https://tnfe.gtimg.com/hel-img/WX20251027-120047.png)

>当前目录不属于大仓 workspace 指定目录，故需要用户单独进入到目录里执行 npm i 安装相关依赖后运行

### 技术栈
前端：react + concent
后端：nodejs + express

### 目录结构
总目录结构如下，具体目录结构说明在各自的目录README.md里

```text
|____client             # 前端工程
|____server             # 后端工程
|____hm-browser-user    # 演示连接 helpack 的前端工程
|____hm-node-user       # 演示连接 helpack 的后端工程
```

### 初始化 helpack 项目

推荐使用 `hel` 命令行

```bash
npm i create-hel -g
# 创建 helpack 项目
hel init myhelpack -t helpack
```

### 快速开始

```bash
pnpm i
# 构建后台
pnpm run build
# 启动 helpack
pnpm run server
# 启动连接本地 helpack 的后端工程
pnpm run usern
# 启动连接本地  helpack 的前端工程
pnpm run userb
```

### 开发、调试、部署

到具体子目录去启动各个项目

- 启动后端
```bash
$ cd server
$ npm run build        // 先编译ts文件
$ npm run start        // 再启动编译好的工程(默认启动快速模式的管理台)
# npm run start:full 启动完整模式的管理台，npm run start:simple 以 api 模式启动，不提供管理台功能
```

- 启动连接 helpack 的后端工程

```bash
$ cd hm-node-user
$ npm run build
$ npm run start:h
# 连接 unpkg
$ npm run start
```


- 启动连接 helpack 的前端工程

```bash
$ cd hm-browser-user
$ npm run start:h
# 连接 unpkg
$ npm run start
```

### 其他

- 启动 helpack 自身的前端工程
```bash
cd client
npm run start
```

> 推荐配置vscode的launch.json文件，方便快速启动并调试，配置如下
```js
{
  "configurations": [
    {
      "name": "debug-helpack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/build/index.js",
      "env": {
        "IS_LOCAL_MODE": "true"
      }
    },
    {
      "name": "debug-hm-node-user",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/hm-node-user/build/index.ts",
      "env": {
        "CONNECT_LOCAL_HELPACK": "1"
      }
    }
  ]
}
```

- deno 启动 hm-node-user

```bash
deno run --allow-net --allow-env --unstable-detect-cjs ./build/index.js
$env:CONNECT_LOCAL_HELPACK=1; deno run --allow-net --allow-env --unstable-detect-cjs ./build/index.js
```

- bun 启动 hm-node-user

```bash
bun start  //本地环境
bun start:h  //连接helpack
```

- 前端部署

**部署前端产物到本地server**

处于前端项目根目录`client`下时，执行
``` bash
npm run build:local
```
会自动清理后端public目录后，再将其构建产物复制到那里
