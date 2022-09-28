<p align="center">
<img width="820px" src="https://tnfe.gtimg.com/image/nesdj6xn5b_1659182715485.png" alt="image.png" />
</p>

# hel-micro-react

依赖 hel-micro 基础 api 实现的 react 组件加载库

## 加载 react 应用

先在主应用头部引入`react runtime`文件，

```html
<script id="leah-runtime" src="https://tnfe.gtimg.com/hel-runtime/level1/16.14.0-react.js"></script>
```

为主应用 webpack 配置 external，让你的应用使用的 react 库和`hel-micro`使用的 react 库是同一个

```js
const externals = {
  react: 'LEAH_React',
  'react-dom': 'LEAH_ReactDOM',
  'react-reconciler': 'LEAH_ReactReconciler',
};
```

之后主应用的任意地方代码都可以实例化`MicroApp`了，

```jsx
import { MicroApp } from 'hel-micro-react';

<MicroApp name="hm-counter" />;
```
