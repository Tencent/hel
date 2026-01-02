---
sidebar_position: 3
---

# hel-mono.json

## 概述

通过改变 `hel-mono.json` 配置项可调整cli运行逻辑、构建产物逻辑等。

## 配置项说明

### defaultStart

默认值：`start:hel`   
作用：影响 `pnpm start ${dir}` 命令行的运行逻辑   
举例：
```bash
pnpm start hub
# 是生成以下命令执行
pnpm --filter hub run start:hel
```
切换为 `start:all` 后
```bash
pnpm start hub
# 是生成以下命令执行
pnpm --filter hub run start:all
```
> 注：`start:hel` 表示以微模块模式启动应用，`start:all` 表示以整体模式启动应用

### defaultBuild

默认值：`build:hel`   
作用：影响 `pnpm start .build ${dir}` 命令行的运行逻辑   
举例：
```bash
pnpm start .build hub
# 是生成以下命令执行
pnpm --filter hub run build:hel
```
切换为 `build:all` 后
```bash
pnpm start .build hub
# 是生成以下命令执行
pnpm --filter hub run build:all
```

### defaultTest

默认值：`test`   
作用：影响 `pnpm start .test ${dir}` 命令行的运行逻辑   
举例：
```bash
pnpm start .test hub
# 是生成以下命令执行
pnpm --filter hub run test
```
切换为 `test:once` 后
```bash
pnpm start .test hub
# 是生成以下命令执行
pnpm --filter hub run test:once
```

### defaultAppPortStart
默认值：`3000`  
作用：执行 `pnpm start .init-mono` 时，大仓助手会以此值作为初始值逐渐加1，得到各个应用本地运行的端口值

### defaultSubModPortStart
默认值：`3100`  
作用：执行 `pnpm start .init-mono` 时，大仓助手会以此值作为初始值逐渐加1，得到各个子模块本地运行的端口值

### defaultAppDir
默认值：`undefined`  
作用：执行短命令 `pnpm start` 时，默认执行的应用目录，未指定时大仓助手会尝试查找第一个

### deployPath
默认值：`https://unpkg.com`   
作用：部署路径，可设置为其他带子路径的域名，例如 https://cdn.jsdelivr.net/npm、https://mycdn.com/hel 等， 最终生成的产物路径形如：https://mycdn.com/hel/some-lib@some-ver/hel_dist， 注：此值的优先级低于执行构建命令时传入的 HEL_APP_HOME_PAGE 、HEL_APP_CDN_PATH 环境变量
，HEL_APP_HOME_PAGE 优先级高于 HEL_APP_CDN_PATH，2者区别在于：
内部对 HEL_APP_HOME_PAGE 不做任何处理，直接当做 publicUrl 交给构建脚本
内对会把 HEL_APP_CDN_PATH 和包名、版本号做拼接操作后再当作 publicUrl 交给构建脚本

- 自己控制部署域名、子目录、版本号
```bash
HEL_APP_HOME_PAGE=https://my-cdn.com/hel/my-lib@my-ver  pnpm run build:helm
```

- 仅控制部署路径，子目录和版本号由大仓助手自动生成
```bash
HEL_APP_CDN_PATH=https://my-cdn.com/hel  pnpm run build:helm
```

### handleDeployPath
默认值：`true`  
作用：是否要对 `deployPath` 做处理，为 true 时表示大仓助手会自动拼接上模块名、版本号参数   

### allowEmptySrcIndex
默认值：`false`   
作用：允许大仓里模块的src目录下没有 index 导出文件，正常情况所有模块都需要有 index 来做统一导出，如存在特殊情况， 为避免 getMonoDevData 获取 appSrcIndex 报错 `Can not find index file ...`， 可配置此参数为 `true`， 此时 appSrcIndex 会为空字符串 `''`


### enableRepoEx
默认值：`false`   
作用：是否使用将大仓所有模块的一级依赖提升为外部资源的功能（内部会自动排除 baseExternals、 customExternals 里的声明）， 
true：会注入大仓所有模块的一级依赖对应的外部资源的链接，需要同时配置 devRepoExLink 和 prodRepoExLink 参数

### devRepoExLink
默认值：`undefined`（在`enableRepoEx`为`true`时，此参数才生效）   
作用：本地开发时大仓使用的 external 资源链接，  
举例：
- 配置为普通链接
```json
  "devRepoExLink": "https://localhost:3003"
```
- 配置为带`data-helex`属性的链接
```json
  "devRepoExLink": { "ex": "Lodash,Dayjs", "link": "https://localhost:3003" }
```
- 配置多个普通链接
```json
  "devRepoExLink": ["https://localhost:3003", "https://localhost:3004"]
```
- 配置多个带`data-helex`属性的链接
```json
  "devRepoExLink": [
    { "ex": "Lodash,Dayjs", "link": "https://localhost:3003" },
    { "ex": "Limu", "link": "https://localhost:3004" },
  ]
```

### prodRepoExLink
默认值：`undefined`（在`enableRepoEx`为`true`时，此参数才生效）      
作用：线上运行时大仓使用的 external 资源链接，用户可在下发首页时根据一定的特征查找并替换掉，

### exConfs
大仓各个模块的外部资源链接配置，通常存在多个宿主且需要对各个宿主定制不同的外部资源链接时，可配置此参数

```json
  "exConfs": {
    "app1": { "enableRepoEx": true, "devRepoExLink": "...", "prodRepoExLink": "..." },
    "app2": { "enableRepoEx": true, "devRepoExLink": "...", "prodRepoExLink": "..." },
  }
```

### displayConsoleLog
默认值：`true`      
作用：是否在控制台展示 hel-mono 相关log，如配置为`false`，用户依然可以到大仓根目录的`./hel`目录项查看各个应用或模块的运行日志

### appsDirs
默认值：`['apps']`   
作用：放置应用的目录名列表

### subModDirs
默认值：`['packages']`   
作用：放置子模块的目录名列表

### baseExternals
默认值：
```json
{ 
  "react": "React", 
  "react-dom": "ReactDOM", 
  "react-is": "ReactIs", 
  "hel-micro": "HelMicro", 
  "hel-lib-proxy": "HelLibProxy", 
  "hel-mono-runtime-helper": "HelMonoRuntimeHelper"
}
```
作用：大仓全局使用的基础外部资源，用户可以按需重写此配置，改写后 `dev/public/index.html` 里的类似 `id="BASE_EX"` 的资源链接也需要替

### customExternals
默认值：`undefined`   
作用：大仓全局使用的用户自定义外部资源，配置后，需要在 `dev/public/index.html` 添加相应链接， 同时需要标记 `data-helex` 记录此资源对应的全局模块名称

### exclude
默认值: `[]`
作用：`start:hel` 或 `build:hel` 时，大仓里的这些包排除到微模块构建体系之外，默认不排除任何包体，如需具体的包名则配置包名到`exclude`数组里即可，如需排除所有，可配置`exclude`为`*`

### nmExclude
默认值: `[]`    
作用：`start:hel` 或 `build:hel 时`，通过 npm 安装到 node_modules 里的这些包排除到微模块构建体系之外（此模块是hel模块时设置此参数才有作用）， 即它们会以原始的npm模块形式运行或被打包到宿主中。

- `*` 表示排除所有
- `[]`表示不排除，如有具体的排除项可配置其包名到数组里

### nmInclude
默认值: `[]`    
作用：`start:hel` 或 `build:hel` 时，通过 npm 安装到 node_modules 里的这些包包含到微模块构建体系之中， `nmExclude` 和 `nmInclude` 同时生效时，`nmExclude` 的优先级高于 `nmInclude`。

举例：
```js
// 包含所有包，但排除 some-lib 包
{
   "nmInclude": "*",
   "nmExclude": ["some-lib"],
}
// 只包含 some-lib 包
{
   "nmInclude": ["some-lib"],
}
```

### devHostname
默认值: `localhost`    
作用：所有hel模块本地联调时的域名

### helMicroName
默认值: `hel-micro`    
作用：模板文件里使用的 hel-micro sdk 名称，如用户基于 hel-micro 向上封装了自己的sdk，这里可配置封装sdk的名称，让生成的模板文件里 sdk 路径指向用户 sdk

### helLibProxyName
默认值: `hel-lib-proxy`    
作用：模板文件里使用的 hel-lib-proxy sdk 名称，如用户基于 hel-lib-proxy 向上封装了自己的sdk，这里可配置封装sdk的名称，让生成的模板文件里 sdk 路径指向用户 sdk

## 注意事项
1. 确保在发布前已正确配置 npm 账号和认证信息
2. 每次发布前需要更新包版本号
3. 建议在发布前进行充分的测试
4. 如果包名为 scoped 包（如 `@my-demo/lib`），需要确保有相应的发布权限
