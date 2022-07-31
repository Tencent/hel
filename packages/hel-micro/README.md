<p align="center">
<img width="820px" src="https://tnfe.gtimg.com/image/nesdj6xn5b_1659182715485.png" alt="image.png" />
</p>

## [Hel](https://tnfe.github.io/hel)
模块联邦sdk化，构建工具无关的微模块方案。
doc: [https://tnfe.github.io/hel](https://tnfe.github.io/hel)

## 优势

### 无痛、极速接入
相比`Module Federation`，需要升级构建工具并做各种改造，`hel`只需要安装sdk 即可

```bash
npm i hel-micro
```

之后即可在项目里加载远程模块
```js
import helMicro from 'hel-micro';

export async function callRemoteMethod() {
  // 懒加载模式，用时才加载
  const lib = await helMicro.preFetchLib('remote-lib-tpl');
  return lib.num.random(22);
}
```

## 更多详情
查看文档 https://tnfe.github.io/hel
