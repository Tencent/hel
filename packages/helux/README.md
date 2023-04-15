# helux
helux是一个鼓励服务注入，并支持响应式变更react的全新数据流方案，为了更符合现在流行的DDD围绕业务构建领域模型而生。

> 它的前身是[concent](https://github.com/concentjs/concent)，经过抛弃面向 class 组件的 api 处理并做大量裁剪后，诞生了`helux`.



拥有以下优势：
- 轻量，压缩后2kb
- 简单，仅暴露6个api
- 高性能，自带依赖收集
- 响应式，支持创建响应式对象，在视图之外变更对象将同步更新视图
- 服务注入，配合`useService`接口轻松控制复杂业务逻辑
- 状态提升0改动，所以地方仅需将`useObject`换为`useSharedObject`即可提升状态共享到其他组件
- 避免forwordRef 地狱，内置的`exposeService`模式将轻松解决父调子时的`ref`转发晦涩理解问题和传染性（隔代组件需要层层转发）
- ts友好，100% ts 编写，为你提供全方位类型提示

![2](https://user-images.githubusercontent.com/7334950/232248704-95532231-ae99-4555-adcd-8d5999a0c5d4.gif)

see [oneline demo](https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx)
