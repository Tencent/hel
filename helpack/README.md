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
```

### 开发、调试、部署
- 启动后端
```bash
$ cd server
$ npm i
$ npm run build        // 先编译ts文件
$ npm run start        // 再启动编译好的工程
```

> 推荐配置vscode的launch.json文件，方便快速启动，配置如下
```js
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug-js",
      "program": "${workspaceFolder}/server/build/index.js",
      "env": {
        "NODE_PATH": "${workspaceFolder}/server/build/",
        "IS_LOCAL_MODE": "true"
      }
    },
    {
      "name": "debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/src/index.ts",
      "outFiles": ["${workspaceFolder}/server/build/**/*.js"],
      "env": {
        "NODE_PATH": "${workspaceFolder}/server/build",
        "IS_LOCAL_MODE": "true"
      }
    }
  ]
}
```

- 启动前端
```bash
cd client
npm i
npm start
```

- 前端部署
**部署到本地server**
处于前端项目根目录`client`下时，执行
``` bash
npm run build:local
```
会自动清理后端public目录后，再将其构建产物复制到那里
