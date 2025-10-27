## 海拉平台前端项目
ui基于`react`，数据层使用[concent](https://github.com/concentjs/concent)

## 运行
- step 1  
进入项目根目录，安装项目依赖
```bash
tnpm i
```  

- step 2  
启动项目，开始开发与调试
```bash
npm start
```

## 发布
- client 目录执行`npm run build:local`
- 提交代码
- 123 打包镜像发布

## 根目录结构
```
|____config             # CRA webpack相关配置[由npm run eject弹出]   
|____mock               # mock api配置
|____public             # webpack-dev-server 静态资源目录
|____scripts            # npm 脚本
|____src                # 项目源码
```

## src目录结构
```
|____configs
| |____constant         # 各种常量定义处
| |____ccReducer        # 暴露concent根reducer
| |____before-init      # App实例化前的前置操作
| 
|____index.js           # app entry file
|____utils              # 通用的非业务相关工具函数集合（可以进一步按用途分类）
| |____...              
|
|____models             # [[business models(全局模块配置)]]
| |____index.js
| |____global
| | |____index.js
| | |____reducer.js     # 修改模块数据方法(可选)
| | |____computed.js    # 模块数据的计算函数(可选)
| | |____watch.js       # 模块数据的观察函数(可选)
| | |____init.js        # 异步初始化模块状态的函数(可选)
| | |____state.js       # 模块状态(必需)
| |____...
|
|____components         # [[多个页面复用的基础组件集合]]
| |____biz-dumb         # 业务相关展示组件
| |____biz-smart        # 业务相关智能组件
| |____dumb             # 非业务的展示组件
| |____smart            # 非业务的智能组件
|
|____pages              # [[router component]]
| |____PageFoo
|   |____ _model        # 当前页面的model定义，方便就近打开就近查看
|   |____ _dumb         # 当前页面的一些业务笨组件（如果出现多个页面重用则可以进一步调整到components/dumb下）
|   |____...
|
|____types             # 类型定义文件夹
| |____store           # store相关的各种类型推导文件
| |____ev-map          # 事件相关的类型定义
| |____domain          # 业务领域相关的对象类型定义，通常是后端返回的对象
| |____biz             # 其他一些全局通用的前端定义的对象类型
|
|
|____services           # [[services，涉及业务io相关、业务通用逻辑相关下沉到此处]]
| |____domain           # 领域模型相关服务
| | |____user
| | |____ticket
| |____commonFunc      # 和领域无关的基础业务函数集合
| |____http             # 其他业务基础服务
| |____...
```