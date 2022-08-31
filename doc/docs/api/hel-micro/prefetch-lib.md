---
sidebar_position: 2
---

# preFetchLib
`preFetchLib`负责拉取并返回远程模块，远程模块通过对接 `hel-lib-proxy` 包的 [exposeLib](https://www.to-be-added.com/coming-soon) 接口弹射出去。

:::tip 面向模块使用方
该接口由模块使用方直接调用，可以基于此接口进一步封装到其他依赖注入框架或体系里
:::

## 基本用法

通过指定模块名称拉取模块，默认总是拉取最新版本，如当前用户在灰度名单里，则返回灰度版本
```ts
const lib = await preFetchLib('hel-remote-lib-tpl');
// lib.xxx 此处可以调用模块任意方法
```

通过指定模块名称、版本号拉取模块
```ts
const lib = await preFetchLib('hel-remote-lib-tpl', { versionId:'1.0.0' });
// lib.xxx 此处可以调用模块任意方法
```


通过指定模块名称、版本号、平台拉取模块，默认是`unpkg`, 当用户独立部署了`Hel Pack`服务并需要跨多个平台获取模块时，需指定平台值
```ts
const lib = await preFetchLib('hel-remote-lib-tpl', { 
  versionId:'hel-remote-lib-tpl_20220522003658', platform:'hel',
});
// lib.xxx 此处可以调用模块任意方法
```

## 静态导入支持
如用户同时发布了npm包，则`preFetchLib`可作为预加载接口使用，先将项目入口文件内容后移一层，即可像本地模块一样头部静态导入远程模块

入口文件后移改造前，`index.js`通常作为项目加载入口做一些初始化动作，然后开始执行渲染根节点等业务逻辑。
```jsx title="src/index.js"
import React from 'react';
import App from 'src/App';
import ReactDOM from 'react-dom';

ReactDOM.render(<App/>, document.getElementById('root'));
```

入口文件后移改造后，原`index.js`内容复制到`loadApp.js`里，`index.js`则用来做模块预拉取之用
```jsx title="src/index.js"
(async function(){
    const helMicro = await import('hel-micro');
    await helMicro.preFetchLib('hel-remote-lib-tpl');
    import('./loadApp')
})()
```

之后你只需要使用npm安装`hel-remote-lib-tpl`包，就可以项目任意文件头部静态导入该模块了
> 如果是懒加载模式，且不关心模块源码与类型，可以不用安装此npm包

```jsx title="src/whatever.js"
import remoteLib from 'hel-remote-lib-tpl';

function callRemoteMethod(){
  return remoteLib.num.random(19);
}
```

## IPreFetchLibOptions

|  <div style={{width:'150px'}}>属性</div>   | <div style={{width:'150px'}}>类型</div>  | <div style={{width:'200px'}}>默认值</div>   |  <div style={{width:'355px'}}>描述</div>  |
|  -------------  | -------------  | -------------  | ---------------------------------------  |
| platform |  string | 'hel'  | 指定获取模块元数据的平台 |
| versionId |  string | undefined  | 指定拉取的版本号, 对于 unpkg 服务来说，版本号级 package.json 里的 version 值<br />未指定版本的话，总是拉取最新版本模块元数据，如当前用户在灰度名单里，则拉取灰度版本模块元数据 |
| appendCss |  boolean | true  | 是否追加模块样式链接到html文档里 |
| cssAppendTypes |  CssAppendType[] | ['static', 'build']  | 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上<br />'static' 表示静态css链接文件<br/>'build' 表示每次构建新生成的css文件 |
| apiMode | 'get' \| 'jsonp' | 'jsonp'  | api 请求方式 |

文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues) ....
